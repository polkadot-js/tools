// Copyright 2018-2023 @polkadot/monitor-rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber, Header } from '@polkadot/types/interfaces';

import Koa from 'koa';
import koaRoute from 'koa-route';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ApiPromise, WsProvider } from '@polkadot/api';

const MAX_ELAPSED = 60000;

interface ArgV { port: number; ws: string }

const { port, ws } = yargs(hideBin(process.argv))
  .options({
    port: {
      default: 9099,
      description: 'The HTTP port to listen on',
      required: true,
      type: 'number'
    },
    ws: {
      description: 'The endpoint to connect to, e.g. wss://kusama-rpc.polkadot.io',
      required: true,
      type: 'string'
    }
  })
  .argv as ArgV;

let currentBlockNumber: BlockNumber | undefined;
let currentTimestamp: Date = new Date();

function checkDelay (): void {
  const elapsed = Date.now() - currentTimestamp.getTime();

  if (elapsed >= MAX_ELAPSED) {
    const secs = (elapsed / 1000).toFixed(2);

    currentBlockNumber && console.error(`ERROR: #${currentBlockNumber.toString()} received at ${currentTimestamp.toString()}, ${secs}s ago`);
  }
}

function updateCurrent (header: Header): void {
  if (currentBlockNumber && header.number.eq(currentBlockNumber.toBn())) {
    return;
  }

  currentBlockNumber = header.number.unwrap();
  currentTimestamp = new Date();

  console.log(`#${currentBlockNumber.toString()} received at ${currentTimestamp.toString()}`);
}

function httpStatus (ctx: Koa.Context): void {
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

process.on('unhandledRejection', (error): void => {
  console.error(error);
  process.exit(1);
});

main().catch((error): void => {
  console.error(error);

  process.exit(1);
});
