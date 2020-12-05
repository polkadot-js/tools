// Copyright 2017-2020 @polkadot/vanitygen authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { GeneratorMatch, GeneratorOptions } from './types';

import { encodeAddress, mnemonicGenerate, naclKeypairFromSeed, randomAsU8a, schnorrkelKeypairFromSeed, mnemonicToMiniSecret } from '@polkadot/util-crypto';

import calculate from './calculate';

export default function generator (test: string[][], options: GeneratorOptions): GeneratorMatch {
  const mnemonic = options.withHex
    ? undefined
    : mnemonicGenerate(12);
  const seed = mnemonic
    ? mnemonicToMiniSecret(mnemonic)
    : randomAsU8a();
  const pair = options.type === 'sr25519'
    ? schnorrkelKeypairFromSeed(seed)
    : naclKeypairFromSeed(seed);
  const address = encodeAddress(pair.publicKey);
  const { count, offset } = calculate(test, address, options);

  return {
    address,
    count,
    mnemonic,
    offset,
    seed
  };
}
