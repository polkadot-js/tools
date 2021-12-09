// Copyright 2018-2021 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';

import { assert } from '@polkadot/util';

export function getTx (api: ApiPromise, name: string): SubmittableExtrinsicFunction<'promise'> {
  const [section, method] = name.split('.');

  assert(api.tx[section] && api.tx[section][method], `Unable to find method ${section}.${method}`);

  return api.tx[section][method];
}
