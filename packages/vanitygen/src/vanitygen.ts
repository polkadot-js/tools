#!/usr/bin/env node
// Copyright 2017-2022 @polkadot/vanitygen authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType } from '@polkadot/util-crypto/types';
import type { GeneratorOptions } from './types';

import yargs from 'yargs';

import { u8aToHex } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import generator from './generator';
import matchRegex from './regex';

interface Best {
  address: string;
  count: number;
  mnemonic?: string;
  offset: number;
  seed?: Uint8Array;
  withCase?: boolean;
}

type ArgV = { match: string; mnemonic: boolean; network: string; type: string; withCase: boolean };

const { match, mnemonic, network, type, withCase } = yargs
  .wrap(120)
  .option('match', {
    default: 'Test',
    type: 'string'
  })
  .option('mnemonic', {
    default: false,
    type: 'boolean'
  })
  .option('network', {
    choices: ['substrate', 'polkadot', 'kusama'],
    default: 'substrate'
  })
  .option('type', {
    choices: ['ed25519', 'sr25519'],
    default: 'sr25519'
  })
  .option('withCase', {
    default: false,
    type: 'boolean'
  })
  .argv as ArgV;

// eslint-disable-next-line prefer-regex-literals
const NUMBER_REGEX = new RegExp('(\\d+?)(?=(\\d{3})+(?!\\d)|$)', 'g');
const INDICATORS = ['|', '/', '-', '\\'];

const options: GeneratorOptions = {
  match,
  network,
  runs: 50,
  ss58Format: 42,
  type: type as KeypairType,
  withCase,
  withHex: !mnemonic
};
const startAt = Date.now();
let best: Best = {
  address: '',
  count: -1,
  offset: 65536
};
let total = 0;
let indicator = -1;
const tests = options.match.split(',');

tests.forEach((test): void => {
  if (!matchRegex.test(test)) {
    console.error("Invalid character found in match string, allowed is '1-9' (no '0'), 'A-H, J-N & P-Z' (no 'I' or 'O'), 'a-k & m-z' (no 'l') and '?' (wildcard)");
    process.exit(-1);
  }
});

switch (network) {
  case 'kusama':
    options.ss58Format = 2;
    break;

  case 'polkadot':
    options.ss58Format = 0;
    break;

  default:
    break;
}

console.log(options);

function showProgress (): void {
  const elapsed = (Date.now() - startAt) / 1000;

  indicator++;

  if (indicator === INDICATORS.length) {
    indicator = 0;
  }

  process.stdout.write(`\r[${INDICATORS[indicator]}] ${(total.toString().match(NUMBER_REGEX) || []).join(',')} keys in ${(elapsed).toFixed(2)}s (${(total / elapsed).toFixed(0)} keys/s)`);
}

function showBest (): void {
  const { address, count, mnemonic, offset, seed } = best;

  console.log(`\r::: ${address.slice(0, offset)}[${address.slice(offset, count + offset)}]${address.slice(count + offset)} <= ${u8aToHex(seed)} (count=${count}, offset=${offset})${mnemonic ? '\n                                                        ' + mnemonic : ''}`);
}

process.on('unhandledRejection', (error): void => {
  console.error(error);
  process.exit(1);
});

cryptoWaitReady()
  .then((): void => {
    while (true) {
      const nextBest = generator(options).found.reduce((best, match): Best => {
        if ((match.count > best.count) || ((match.count === best.count) && (match.offset <= best.offset))) {
          return match;
        }

        return best;
      }, best);

      total += options.runs;

      if (nextBest.address !== best.address) {
        best = nextBest;
        showBest();
        showProgress();
      } else if ((total % (options.withHex ? 1000 : 100)) === 0) {
        showProgress();
      }
    }
  })
  .catch((error: Error): void => console.error(error));
