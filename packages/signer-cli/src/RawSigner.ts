// Copyright 2018-2024 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Signer, SignerResult } from '@polkadot/api/types';
import type { SignerPayloadRaw } from '@polkadot/types/types';

import * as readline from 'node:readline';

import { assert, isHex } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

export default class RawSigner implements Signer {
  public async signRaw ({ data }: SignerPayloadRaw): Promise<SignerResult> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve): void => {
      const hashed = (data.length > (256 + 1) * 2)
        ? blake2AsHex(data)
        : data;

      rl.question(`Payload: ${hashed}\nSignature> `, (_signature) => {
        const signature = _signature.trim();

        assert(isHex(signature), 'Supplied signature is not hex');

        resolve({ id: 1, signature });
        rl.close();
      });
    });
  }
}
