// Copyright 2018-2020 @polkadot/signer-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as readline from 'readline';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Index, SignerPayload, BlockNumber } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic, SignerOptions } from '@polkadot/api/submittable/types';
import { Compact } from '@polkadot/types';
import { assert } from '@polkadot/util';

function getSignature (data: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve): void => {
    rl.question(`Payload: ${data}\nSignature> `, signature => {
      resolve(signature);
      rl.close();
    });
  });
}

export default async function cmdSendOffline (
  account: string,
  blocks: number | undefined,
  endpoint: string,
  nonce: number | undefined | Index,
  [tx, ...params]: string[]
): Promise<void> {
  const provider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider });
  const [section, method] = tx.split('.');

  assert(api.tx[section] && api.tx[section][method], `Unable to find method ${section}.${method}`);

  let options: SignerOptions | object = {};
  let blockNumber: Compact<BlockNumber> | number | null = null;
  nonce = nonce || await api.query.system.accountNonce(account);

  if (blocks === 0) {
    options = {
      era: 0,
      blockHash: api.genesisHash,
      nonce
    };
    blockNumber = 0;
  } else if (blocks != null) {
    // Get current block if we want to modify the number of blocks we have to sign
    const signedBlock = await api.rpc.chain.getBlock();
    options = {
      blockHash: signedBlock.block.header.hash,
      era: api.createType('ExtrinsicEra', {
        current: signedBlock.block.header.number,
        period: blocks
      }),
      nonce
    };
    blockNumber = signedBlock.block.header.number;
  }

  const transaction: SubmittableExtrinsic<'promise'> = api.tx[section][method](...params);

  const payload: SignerPayload = api.createType('SignerPayload', {
    version: api.extrinsicVersion,
    runtimeVersion: api.runtimeVersion,
    genesisHash: api.genesisHash,
    ...options,
    address: account,
    method: transaction.method,
    blockNumber
  });

  const signature = await getSignature(payload.toRaw().data);

  transaction.addSignature(account, signature, payload.toPayload());

  console.log('\nSigned transaction:\n' + transaction.toJSON());

  process.exit(0);
}
