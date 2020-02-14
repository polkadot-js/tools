// Copyright 2018-2020 @polkadot/signer-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerOptions } from '@polkadot/api/submittable/types';
import { SignerPayloadRaw } from '@polkadot/types/types';

import * as readline from 'readline';
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

function submitPreSignedTx (api: ApiPromise, tx: string): void {
  const extrinsic = api.createType('Extrinsic', tx);

  api.rpc.author.submitAndWatchExtrinsic(extrinsic, result => {
    console.log(JSON.stringify(result));

    if (result.isInBlock || result.isFinalized) {
      process.exit(0);
    }
  });
}

export default async function cmdSubmit (account: string, blocks: number | undefined, endpoint: string, tx: string | undefined, [txName, ...params]: string[]): Promise<void> {
  const signer = new RawSigner();
  const provider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider, signer });

  if (tx) {
    return submitPreSignedTx(api, tx);
  }

  const [section, method] = txName.split('.');

  assert(api.tx[section] && api.tx[section][method], `Unable to find method ${section}.${method}`);

  const options: Partial<SignerOptions> = {};
  if (blocks === 0) {
    options.era = 0;
  } else if (blocks != null) {
    // Get current block if we want to modify the number of blocks we have to sign
    const signedBlock = await api.rpc.chain.getBlock();

    options.blockHash = signedBlock.block.header.hash;
    options.era = api.createType('ExtrinsicEra', {
      current: signedBlock.block.header.number,
      period: blocks
    });
  }

  await api.tx[section][method](...params).signAndSend(account, options, (result): void => {
    console.log(JSON.stringify(result));

    if (result.isInBlock || result.isFinalized) {
      process.exit(0);
    }
  });
}
