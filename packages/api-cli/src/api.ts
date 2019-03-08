// Copyright 2018 @polkadot/api-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import yargs from 'yargs';
import { ApiPromise, WsProvider } from '@polkadot/api';

async function main (): Promise<void> {
  const { ws } = yargs
    .strict()
    .options({
      ws: {
        default: 'ws://127.0.0.1:9944',
        description: 'The API endpoint to connect to, e.g. wss://poc3-rpc.polkadot.io',
        type: 'string',
        required: true
      }
    })
    .argv;

  const provider = new WsProvider(ws);
  const api = await ApiPromise.create({ provider });

  console.log(api);
}

main()
  .then(() => {
    // ignore
  })
  .catch((error) => {
    console.error('ERROR:', error);

    process.exit(1);
  });
