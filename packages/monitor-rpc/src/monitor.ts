// Copyright 2018 @polkadot/monitor-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import yargs from 'yargs';
import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { BlockNumber, Header } from '@polkadot/types';

const MAX_ELAPSED = 60000;

let currentBlockNumber: BlockNumber;
let currentTimestamp: Date;

function checkDelay () {
  if (!currentTimestamp) {
    return;
  }

  const elapsed = Date.now() - currentTimestamp.getTime();

  if (elapsed > MAX_ELAPSED) {
    console.error(`ERROR: #${currentBlockNumber} received at ${currentTimestamp}, ${(elapsed/1000).toFixed(2)}s ago`);
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

async function main (): Promise<void> {
  const { url } = yargs.options({
    url: {
      description: 'The endpoint to connect to, e.g. wss://poc-2.polkadot.io',
      type: 'string',
      required: true
    }
  }).argv;

  const provider = new WsProvider(url);
  const api = await ApiPromise.create(provider);

  api.rpc.chain.subscribeNewHead(updateCurrent);

  setInterval(checkDelay, 1000);
}

main().catch((error) => {
  console.error('ERROR:', error);

  process.exit(1);
});
