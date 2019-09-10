// Copyright 2019 @polkadot/signer-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import yargs from 'yargs';

import cmdSign from './cmdSign';
import cmdSubmit from './cmdSubmit';

// retrieve and parse arguments - we do this globally, since this is a single command
const { _: [command, ...params], account, seed, type, ws } = yargs
  .usage('Usage: [options] <endpoint> <...params>')
  .usage('Example: submit --account D3AhD...wrx --ws wss://... balances.transfer F7Gh 10000 ')
  .usage('Example: sign --seed "..." --account D3AhD...wrx --crypto ed25519 0x123...789')
  .wrap(120)
  .options({
    account: {
      description: 'The actual address for the signer',
      type: 'string',
      required: true
    },
    seed: {
      description: 'The account seed to use (sign only)',
      type: 'string'
    },
    type: {
      choices: ['ed25519', 'sr25519'],
      default: 'sr25519',
      description: 'The account crypto signature to use (sign only)',
      type: 'string'
    },
    ws: {
      description: 'The API endpoint to connect to, e.g. wss://poc3-rpc.polkadot.io (submit only)',
      type: 'string'
    }
  })
  .strict()
  .argv;

// our main entry point - from here we call out
// eslint-disable-next-line @typescript-eslint/require-await
async function main (): Promise<void> {
  if (command === 'sign') {
    return cmdSign(account, seed || '', type as 'ed25519', params);
  } else if (command === 'submit') {
    return cmdSubmit(account, ws || '', params);
  }

  throw new Error(`Unknown command '${command}' found, expected one of 'sign' or 'submit'`);
}

main().catch((error): void => {
  console.error('ERROR:', error.message);

  process.exit(1);
});
