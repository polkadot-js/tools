// Copyright 2018-2020 @polkadot/signer-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import yargs from 'yargs';
import { hexMiddleware, jsonMiddleware, parseParams } from '@polkadot/api-cli/cli';

import cmdSign from './cmdSign';
import cmdSubmit from './cmdSubmit';
import cmdSendOffline from './cmdSendOffline';

const BLOCKTIME = 6;
const ONE_MINUTE = 60 / BLOCKTIME;

const { _: [command, ...paramsInline], account, blocks, minutes, nonce, params: paramsFile, seed, type, ws, tx } = yargs
  .usage('Usage: [options] <endpoint> <...params>')
  .usage('Example: submit --account D3AhD...wrx --ws wss://... balances.transfer F7Gh 10000 ')
  .usage('Example: sign --seed "..." --account D3AhD...wrx --type ed25519 0x123...789')
  .usage('Example: sendOffline --seed "..." --account D3AhD...wrx --type ed25519 0x123...789')
  .middleware(hexMiddleware)
  .middleware(jsonMiddleware)
  .wrap(120)
  .options({
    account: {
      description: 'The actual address for the signer',
      type: 'string'
    },
    blocks: {
      default: undefined as number | undefined,
      description: 'Exact number of blocks for a transaction to be signed and submitted before becoming invalid (mortality in blocks). Set to 0 for an immortal transaction (not recommended)',
      type: 'number'
    },
    minutes: {
      default: undefined as number | undefined,
      description: 'Approximate time for a transaction to be signed and submitted before becoming invalid (mortality in minutes)',
      type: 'number'
    },
    nonce: {
      default: undefined as number | undefined,
      description: 'Transaction nonce (sendOffline only)',
      type: 'number'
    },
    params: {
      description: 'Location of file containing space-separated transaction parameters (optional)',
      type: 'string'
    },
    seed: {
      description: 'The account seed to use (sign only)',
      type: 'string'
    },
    tx: {
      description: 'Pre-signed transaction generated using e.g. the sendOffline command. If provided, only --ws is required as well (submit only)',
      type: 'string'
    },
    type: {
      choices: ['ed25519', 'sr25519'],
      default: 'sr25519',
      description: 'The account crypto signature to use (sign only)',
      type: 'string'
    },
    ws: {
      description: 'The API endpoint to connect to, e.g. wss://kusama-rpc.polkadot.io (submit and sendOffline only)',
      type: 'string'
    }
  })
  .strict()
  .parserConfiguration({
    'parse-numbers': false
  })
  .argv;

const params = parseParams(paramsInline, paramsFile);

// our main entry point - from here we call out
// eslint-disable-next-line @typescript-eslint/require-await
async function main (): Promise<void> {
  if (command === 'sign') {
    return cmdSign(account as string, seed || '', type as 'ed25519', params);
  } else if (command === 'submit') {
    const mortality = minutes != null ? minutes * ONE_MINUTE : blocks;

    return cmdSubmit(account as string, mortality, ws || '', tx, params);
  } else if (command === 'sendOffline') {
    const mortality = minutes != null ? minutes * ONE_MINUTE : blocks;

    return cmdSendOffline(account as string, mortality, ws || '', nonce, params);
  }

  throw new Error(`Unknown command '${command}' found, expected one of 'sign', 'submit' or 'sendOffline'`);
}

main().catch((error): void => {
  console.error(error);

  process.exit(1);
});
