// Copyright 2018 @polkadot/api-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import yargs from 'yargs';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert } from '@polkadot/util';

async function main (): Promise<void> {
  const { _: [endpoint, ...params], sub, ws } = yargs
    .options({
      sub: {
        description: 'With this flag set, perofm subscriptions, running until exited with ^C',
        type: 'boolean'
      },
      ws: {
        default: 'ws://127.0.0.1:9944',
        description: 'The API endpoint to connect to, e.g. wss://poc3-rpc.polkadot.io',
        type: 'string',
        required: true
      }
    })
    .argv;

  assert(endpoint && endpoint.indexOf('.') !== -1, `You need to specify the command to execure, e.g. query.balances.freeBalance`);

  const provider = new WsProvider(ws);
  const api = await ApiPromise.create({ provider });
  const [type, section, method] = endpoint.split('.');

  assert(['derive', 'query', 'rpc', 'tx'].includes(type), `Expected one of derive, query, rpc, tx, found ${type}`);
  assert((api as any)[type][section], `Cannot find ${type}.${section}`);
  assert((api as any)[type][section][method], `Cannot find ${type}.${section}.${method}`);

  const fn = (api as any)[type][section][method];

  return sub
    ? fn(...params, (result: any) => {
      console.log(result);
    })
    : fn(...params).then((result: any) => {
      console.log(result);

      process.exit(0);
    });
}

main()
  .then(() => {
    // do nothing
  })
  .catch((error) => {
    console.error('ERROR:', error.message);

    process.exit(1);
  });
