// Copyright 2017-2024 @polkadot/vanitygen authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { GeneratorMatch } from './types.js';

function numberSort (a: number, b: number): number {
  if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  }

  return 0;
}

export default function sort (a: GeneratorMatch, b: GeneratorMatch): number {
  const countResult = numberSort(a.count, b.count);

  if (countResult !== 0) {
    return countResult;
  }

  const positionResult = numberSort(b.offset, a.offset);

  if (positionResult !== 0) {
    return positionResult;
  }

  return a.address.localeCompare(b.address);
}
