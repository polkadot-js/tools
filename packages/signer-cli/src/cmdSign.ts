// Copyright 2018-2020 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Keyring } from '@polkadot/keyring';
import { assert, hexToU8a, isHex, u8aToHex } from '@polkadot/util';
import { cryptoWaitReady, keyExtractSuri, mnemonicValidate } from '@polkadot/util-crypto';

type Curves = 'ed25519' | 'sr25519';

const SEED_LENGTHS = [12, 15, 18, 21, 24];

/**
  * Seed here can be any of the following:
  *  - mnemonic (with/without derivation path): <mnemonic>[//<hard>/<soft>///<password>]
  *  - hex seed (with/without derivation path): <hex>[//<hard>/<soft>///<password>]
*/
function validateSeed (suri: string) {
  const { phrase } = keyExtractSuri(suri);

  if (isHex(phrase)) {
    assert(isHex(phrase, 256), 'Hex seed needs to be 256-bits');
  } else {
    // sadly isHex detects as string, so we need a cast here
    assert(SEED_LENGTHS.includes((phrase as string).split(' ').length), `Mnemonic needs to contain ${SEED_LENGTHS.join(', ')} words`);
    assert(mnemonicValidate(phrase), 'Not a valid mnemonic seed');
  }
}

function validatePayload (payload: string) {
  assert(payload && payload.length > 0, 'Cannot sign empty payload. Please check your input and try again.');
  assert(isHex(payload), 'Payload must be supplied as a hex string. Please check your input and try again.');
}

export default async function cmdSign (_: string, suri: string, type: Curves, [payload]: string[]): Promise<void> {
  validateSeed(suri);
  validatePayload(payload);

  await cryptoWaitReady();

  const keyring = new Keyring({ type });
  const pair = keyring.createFromUri(suri);
  const signature = pair.sign(hexToU8a(payload), { withType: true });

  console.log(`Signature: ${u8aToHex(signature)}`);
  process.exit(0);
}
