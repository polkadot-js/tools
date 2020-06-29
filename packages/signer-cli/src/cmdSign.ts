// Copyright 2018-2020 @polkadot/signer-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/keyring';
import { assert, hexToU8a, isHex, u8aToHex, u8aConcat } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';

type Curves = 'ed25519' | 'sr25519';

const curvePrefixes: {[key in Curves]: [number] } = {
  ed25519: [0],
  sr25519: [1]
};

export default async function cmdSign (_: string, seed: string, type: Curves, [payload]: string[]): Promise<void> {
  assert(payload && payload.length > 0, 'Cannot sign empty payload. Please check your input and try again.');
  assert(isHex(payload), 'Payload must be supplied as a hex string. Please check your input and try again.');

  await cryptoWaitReady();

  const keyring = new Keyring({ type });
  const pair = keyring.createFromUri(seed);
  const signature = pair.sign(hexToU8a(payload));
  const prefix = new Uint8Array(curvePrefixes[type]);

  console.log(`Signature: ${u8aToHex(u8aConcat(prefix, signature))}`);
  process.exit(0);
}
