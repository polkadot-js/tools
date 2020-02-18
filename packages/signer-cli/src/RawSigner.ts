// Copyright 2018-2020 @polkadot/signer-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadRaw } from '@polkadot/types/types';

import * as readline from 'readline';

export default class RawSigner implements Signer {
  public async signRaw ({ data }: SignerPayloadRaw): Promise<SignerResult> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve): void => {
      rl.question(`Payload: ${data}\nSignature> `, (signature) => {
        resolve({ id: 1, signature });
        rl.close();
      });
    });
  }
}
