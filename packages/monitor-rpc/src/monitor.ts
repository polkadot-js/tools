// Copyright 2018 @polkadot/monitor-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Koa, { Context } from 'koa';
import koaRoute from 'koa-route';
import yargs from 'yargs';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BlockNumber, Header } from '@polkadot/types';

const MAX_ELAPSED = 60000;

let currentBlockNumber: BlockNumber = new BlockNumber(0);
let currentTimestamp: Date = new Date();

function checkDelay () {
  const elapsed = Date.now() - currentTimestamp.getTime();

  if (elapsed >= MAX_ELAPSED) {
    const secs = (elapsed / 1000).toFixed(2);

    console.error(`ERROR: #${currentBlockNumber} received at ${currentTimestamp}, ${secs}s ago`);
  }
}

function updateCurrent (header: Header) {
  if (currentBlockNumber && header.blockNumber.eq(currentBlockNumber.toBn())) {
    return;
  }

  currentBlockNumber = header.blockNumber;
  currentTimestamp = new Date();

  console.log(`#${currentBlockNumber} received at ${currentTimestamp}`);
}

function httpStatus (ctx: Context) {
  const elapsed = Date.now() - currentTimestamp.getTime();

  ctx.body = {
    blockNumber: currentBlockNumber.toNumber(),
    blockTimestamp: currentTimestamp ? currentTimestamp.toISOString() : '',
    elapsed: elapsed / 1000,
    ok: elapsed < MAX_ELAPSED
  };
}

async function main (): Promise<void> {
  const { port, url } = yargs.options({
    port: {
      description: 'The HTTP port to listen on',
      type: 'number',
      default: 9099,
      required: true
    },
    url: {
      description: 'The endpoint to connect to, e.g. wss://poc3-rpc.polkadot.io',
      type: 'string',
      required: true
    }
  }).argv;

  const app = new Koa();

  app.use(koaRoute.all('/', httpStatus));
  app.listen(port);

  const provider = new WsProvider(url);
  const api = await ApiPromise.create({ provider });

  await api.rpc.chain.subscribeNewHead(updateCurrent);

  setInterval(checkDelay, 1000);
}

main()
  .then(() => {
    // ignore
  })
  .catch((error) => {
    console.error('ERROR:', error);

    process.exit(1);
  });
