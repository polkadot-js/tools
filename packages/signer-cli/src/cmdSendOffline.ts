// Copyright 2018-2020 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Index, SignerPayload, BlockNumber } from '@polkadot/types/interfaces';
import type { SubmittableExtrinsic, SignerOptions } from '@polkadot/api/submittable/types';
import type { Compact } from '@polkadot/types';

import * as readline from 'readline';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert } from '@polkadot/util';

function getSignature (data: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve): void => {
    rl.question(`Payload: ${data}\nSignature> `, (signature) => {
      resolve(signature);
      rl.close();
    });
  });
}

export default async function cmdSendOffline (account: string, blocks: number | undefined, endpoint: string, nonce: number | undefined | Index, [tx, ...params]: string[]): Promise<void> {
  const provider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider });
  const [section, method] = tx.split('.');

  assert(api.tx[section] && api.tx[section][method], `Unable to find method ${section}.${method}`);

  if (!blocks && blocks !== 0) {
    blocks = 50;
  }

  if (!nonce && nonce !== 0) {
    nonce = (await api.derive.balances.account(account)).accountNonce;
  }

  let options: SignerOptions;
  let blockNumber: Compact<BlockNumber> | number | null = null;

  if (blocks === 0) {
    options = {
      blockHash: api.genesisHash,
      era: 0,
      nonce
    };
    blockNumber = 0;
  } else {
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
    genesisHash: api.genesisHash,
    runtimeVersion: api.runtimeVersion,
    version: api.extrinsicVersion,
    ...options,
    address: account,
    blockNumber,
    method: transaction.method
  });
  const signature = await getSignature(payload.toRaw().data);

  transaction.addSignature(account, signature, payload.toPayload());
  console.log('\nSigned transaction:\n' + transaction.toJSON());
  process.exit(0);
}
