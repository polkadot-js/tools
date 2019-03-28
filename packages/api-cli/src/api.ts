// Copyright 2019 @polkadot/api-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import yargs from 'yargs';
import { ApiPromise, WsProvider, SubmittableResult } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { assert } from '@polkadot/util';

const CRYPTO = ['ed25519', 'sr25519'];

async function main (): Promise<void> {
  const { _: [endpoint, ...params], info, seed, sign, sub, ws } = yargs
    .usage('Usage: [options] <endpoint> <...params>')
    .usage('Example: query.balances.freeBalance 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKv3gB')
    .usage('Example: query.substrate.code --info')
    .usage('Example: --seed "//Alice" tx.balances.transfer F7Gh 10000')
    .wrap(120)
    .options({
      info: {
        description: 'Shows the meta information for the call',
        type: 'boolean'
      },
      seed: {
        description: 'The account seed to use (required for tx.* only)',
        type: 'string'
      },
      sign: {
        choices: CRYPTO,
        default: 'sr25519',
        description: 'The account crypto signature to use (required fo tx.* only)',
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
    .strict()
    .argv;

  assert(endpoint && endpoint.indexOf('.') !== -1, `You need to specify the command to execute, e.g. query.balances.freeBalance`);

  const provider = new WsProvider(ws);
  const api = await ApiPromise.create({ provider });
  const [type, section, method] = endpoint.split('.');

  assert(['derive', 'query', 'rpc', 'tx'].includes(type), `Expected one of derive, query, rpc, tx, found ${type}`);
  assert((api as any)[type][section], `Cannot find ${type}.${section}`);
  assert((api as any)[type][section][method], `Cannot find ${type}.${section}.${method}`);

  const fn = (api as any)[type][section][method];
  const log = (result: any) =>
    console.log(JSON.stringify({ [method]: result }, null, 2));

  if (info) {
    console.log(`# ${section}.${method}\n`);

    if (fn.description) {
      console.log(fn.description);
    } else if (fn.meta) {
      fn.meta.documentation.forEach((doc: String) => console.log(doc.toString()));
    } else {
      console.log('No documentation available');
    }

    // Empty line at the end to make it pretty
    console.log();

    process.exit(0);
  }

  if (type === 'tx') {
    assert(seed, 'You need to specify an account seed with tx.*');
    assert(CRYPTO.includes(sign), `The crypto type can only be one of ${CRYPTO.join(', ')} found '${sign}'`);

    const keyring = new Keyring();
    const account = keyring.createFromUri(seed as string, {}, sign as any);

    return fn(...params).signAndSend(account, (result: SubmittableResult) => {
      log(result);

      if (result.type === 'Finalised') {
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

main().catch((error) => {
  console.error('ERROR:', error.message);

  process.exit(1);
});
