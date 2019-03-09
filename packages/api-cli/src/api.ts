// Copyright 2018 @polkadot/api-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import yargs from 'yargs';
import { ApiPromise, WsProvider, SubmittableResult } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { assert, hexToU8a, isHex, stringToU8a } from '@polkadot/util';

async function main (): Promise<void> {
  const log = (result: any) =>
    console.log(JSON.stringify({ [method]: result }));

  const { _: [endpoint, ...params], info, seed, sub, ws } = yargs
    .usage('Usage: [options] <endpoint> <...params>')
    .usage('Example: query.balances.freeBalance 5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ')
    .usage('Example: query.substrate.code --info')
    .usage('Example: --seed Alice tx.balances.transfer F7Gh 10000')
    .wrap(120)
    .options({
      info: {
        description: 'Shows the meta information for the call',
        type: 'boolean'
      },
      seed: {
        description: 'The account seed to use (for tx.* only)',
        type: 'string'
      },
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

  if (info) {
    console.log(`# ${section}.${method}\n`);

    if (fn.description) {
      console.log(fn.description);
    } else if (fn.meta) {
      fn.meta.documentation.forEach((doc: String) => console.log(doc.toString()));
    } else {
      console.log('No documentation available');
    }

    console.log();

    process.exit(0);
  }

  if (type === 'tx') {
    assert(seed, 'You need to specify an account seed with tx.*');

    const keyring = new Keyring();
    const account = keyring.addFromSeed(
      isHex(seed)
        ? hexToU8a(seed)
        : stringToU8a((seed as any).padEnd(32))
    );

    return fn(...params).signAndSend(account, (result: SubmittableResult) => {
      log(result);

      if (result.type === 'finalised') {
        process.exit(0);
      }
    });
  }

  return sub
    ? fn(...params, log)
    : fn(...params).then(log).then(() => {
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
