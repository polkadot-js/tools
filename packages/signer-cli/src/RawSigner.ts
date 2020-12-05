// Copyright 2018-2020 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Signer, SignerResult } from '@polkadot/api/types';

import { SignerPayloadRaw } from '@polkadot/types/types';
import { blake2AsHex } from '@polkadot/util-crypto';

import * as readline from 'readline';

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

      rl.question(`Payload: ${hashed}\nSignature> `, (signature) => {
        resolve({ id: 1, signature });
        rl.close();
      });
    });
  }
}
