// Copyright 2018-2025 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { hexMiddleware, jsonMiddleware, parseParams } from '@polkadot/api-cli/cli';
import { assert } from '@polkadot/util';

import cmdSendOffline from './cmdSendOffline.js';
import cmdSign from './cmdSign.js';
import cmdSubmit from './cmdSubmit.js';

interface ArgV {
  _: string[];
  account?: string;
  blocks?: number;
  minutes?: number;
  nonce?: number;
  params?: string;
  seed?: string;
  type?: string;
  ws?: string;
  tx?: string;
}

const BLOCKTIME = 6;
const ONE_MINUTE = 60 / BLOCKTIME;

const { _: [command, ...paramsInline], account, blocks, minutes, nonce, params: paramsFile, seed, tx, type, ws } = yargs(hideBin(process.argv))
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
      choices: ['ed25519', 'sr25519', 'ecdsa'],
      default: 'sr25519',
      description: 'The account crypto signature to use (sign only)',
      type: 'string'
    },
    ws: {
      description: 'The API endpoint to connect to, e.g. wss://kusama-rpc.polkadot.io (submit and sendOffline only)',
      type: 'string'
    }
  })
  .parserConfiguration({
    'parse-numbers': false,
    'parse-positional-numbers': false
  })
  .argv as ArgV;

const params = parseParams(paramsInline, paramsFile);

// our main entry point - from here we call out
// eslint-disable-next-line @typescript-eslint/require-await
async function main (): Promise<void> {
  assert(['sign', 'submit', 'sendOffline'].includes(command), `Unknown command '${command}' found, expected one of 'sign', 'submit' or 'sendOffline'`);

  const mortality = minutes != null
    ? minutes * ONE_MINUTE
    : blocks;

  if (!account) {
    throw new Error('No account has been specified, unable to sign');
  }

  return command === 'sign'
    ? cmdSign(account, seed, type as 'ed25519', params)
    : command === 'submit'
      ? cmdSubmit(account, mortality, ws, tx, params)
      : cmdSendOffline(account, mortality, ws, nonce, params);
}

process.on('unhandledRejection', (error): void => {
  console.error(error);
  process.exit(1);
});

main().catch((error): void => {
  console.error(error);

  process.exit(1);
});
