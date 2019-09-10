// Copyright 2019 @polkadot/signer-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/keyring';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';

export default async function cmdSign (account: string, seed: string, type: 'ed25519' | 'sr25519', [payload]: string[]): Promise<void> {
  await cryptoWaitReady();

  const keyring = new Keyring({ type });
  const pair = keyring.createFromUri(seed);
  const signature = pair.sign(hexToU8a(payload));

  console.log(`Signature: ${u8aToHex(signature)}`);

  process.exit(0);
}
