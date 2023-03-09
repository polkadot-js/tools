// Copyright 2017-2023 @polkadot/vanitygen authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { GeneratorMatches, GeneratorOptions, GeneratorResult } from './types';

import generate from './generate.js';

export default function generator (options: GeneratorOptions): GeneratorResult {
  const { match, runs = 10, withCase = false } = options;
  const found: GeneratorMatches = [];
  const startAt = Date.now();
  const test = (withCase ? match : match.toLowerCase())
    .split(',')
    .map((c): string[] => c.split(''));

  while (found.length !== runs) {
    found.push(generate(test, options));
  }

  return {
    elapsed: Date.now() - startAt,
    found
  };
}
