// Copyright 2017-2025 @polkadot/vanitygen authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { GeneratorMatch, GeneratorOptions } from './types.js';

import { ed25519PairFromSeed, encodeAddress, mnemonicGenerate, mnemonicToMiniSecret, randomAsU8a, sr25519PairFromSeed } from '@polkadot/util-crypto';

import calculate from './calculate.js';

export default function generator (test: string[][], options: GeneratorOptions): GeneratorMatch {
  const mnemonic = options.withHex
    ? undefined
    : mnemonicGenerate(12);
  const seed = mnemonic
    ? mnemonicToMiniSecret(mnemonic)
    : randomAsU8a();
  const pair = options.type === 'sr25519'
    ? sr25519PairFromSeed(seed)
    : ed25519PairFromSeed(seed);
  const address = encodeAddress(pair.publicKey, options.ss58Format);
  const { count, offset } = calculate(test, address, options);

  return {
    address,
    count,
    mnemonic,
    offset,
    seed
  };
}
