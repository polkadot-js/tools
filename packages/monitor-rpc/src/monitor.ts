// Copyright 2018-2019 @polkadot/monitor-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Header } from '@polkadot/types/interfaces';

import Koa, { Context } from 'koa';
import koaRoute from 'koa-route';
import yargs from 'yargs';
import { ApiPromise, WsProvider } from '@polkadot/api';

const MAX_ELAPSED = 60000;

const { port, ws } = yargs
  .strict()
  .options({
    port: {
      description: 'The HTTP port to listen on',
      type: 'number',
      default: 9099,
      required: true
    },
    ws: {
      description: 'The endpoint to connect to, e.g. wss://kusama-rpc.polkadot.io',
      type: 'string',
      required: true
    }
  })
  .argv;

let currentBlockNumber: BlockNumber | undefined;
let currentTimestamp: Date = new Date();

function checkDelay (): void {
  const elapsed = Date.now() - currentTimestamp.getTime();

  if (elapsed >= MAX_ELAPSED) {
    const secs = (elapsed / 1000).toFixed(2);

    console.error(`ERROR: #${currentBlockNumber} received at ${currentTimestamp}, ${secs}s ago`);
  }
}

function updateCurrent (header: Header): void {
  if (currentBlockNumber && header.number.eq(currentBlockNumber.toBn())) {
    return;
  }

  currentBlockNumber = header.number.unwrap();
  currentTimestamp = new Date();

  console.log(`#${currentBlockNumber} received at ${currentTimestamp}`);
}

function httpStatus (ctx: Context): void {
  const elapsed = Date.now() - currentTimestamp.getTime();

  ctx.body = {
    blockNumber: currentBlockNumber?.toNumber(),
    blockTimestamp: currentTimestamp.toISOString(),
    elapsed: elapsed / 1000,
    ok: elapsed < MAX_ELAPSED
  };
}

async function main (): Promise<void> {
  const app = new Koa();

  app.use(koaRoute.all('/', httpStatus));
  app.listen(port);

  const provider = new WsProvider(ws);
  const api = await ApiPromise.create({ provider });

  await api.rpc.chain.subscribeNewHeads(updateCurrent);

  setInterval(checkDelay, 1000);
}

main().catch((error): void => {
  console.error(error);

  process.exit(1);
});
