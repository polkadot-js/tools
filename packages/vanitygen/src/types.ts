// Copyright 2017-2020 @polkadot/vanitygen authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeypairType } from '@polkadot/util-crypto/types';

export interface GeneratorCalculation {
  count: number;
  offset: number;
}

export interface GeneratorMatch extends GeneratorCalculation {
  address: string;
  mnemonic?: string;
  seed: Uint8Array;
}

export type GeneratorMatches = GeneratorMatch[];

export interface GeneratorOptions {
  atOffset?: number;
  match: string;
  network?: string;
  runs: number;
  type: KeypairType;
  withCase?: boolean;
  withHex?: boolean;
}

export interface GeneratorResult {
  elapsed: number;
  found: GeneratorMatches;
}
