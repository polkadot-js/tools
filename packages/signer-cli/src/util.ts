// Copyright 2018-2023 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SignerOptions } from '@polkadot/api/submittable/types';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';

import { assert } from '@polkadot/util';

export function getTx (api: ApiPromise, name: string): SubmittableExtrinsicFunction<'promise'> {
  const [section, method] = name.split('.');

  assert(api.tx[section] && api.tx[section][method], `Unable to find method ${section}.${method}`);

  return api.tx[section][method];
}

export async function mortalityOpts (api: ApiPromise, options: Partial<SignerOptions>, period: number): Promise<void> {
  // Get current block if we want to modify the number of blocks we have to sign
  const signedBlock = await api.rpc.chain.getBlock();

  options.blockHash = signedBlock.block.header.hash;
  options.era = api.createType('ExtrinsicEra', {
    current: signedBlock.block.header.number,
    period
  });
}
