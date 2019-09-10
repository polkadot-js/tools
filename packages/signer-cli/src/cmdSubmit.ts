// Copyright 2019 @polkadot/signer-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadRaw } from '@polkadot/types/types';

import readline from 'readline';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert } from '@polkadot/util';

class RawSigner implements Signer {
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

export default async function cmdSubmit (account: string, endpoint: string, [tx, ...params]: string[]): Promise<void> {
  const signer = new RawSigner();
  const provider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider, signer });
  const [section, method] = tx.split('.');

  assert(api.tx[section] && api.tx[section][method], `Unable to find method ${section}.${method}`);

  await api.tx[section][method](...params).signAndSend(account, (result): void => {
    console.log(JSON.stringify(result));

    if (result.isFinalized) {
      process.exit(0);
    }
  });
}
