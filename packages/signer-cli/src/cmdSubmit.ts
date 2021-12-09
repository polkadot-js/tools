// Copyright 2018-2021 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignerOptions } from '@polkadot/api/submittable/types';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { stringify } from '@polkadot/util';

import RawSigner from './RawSigner';
import { getTx } from './util';

function submitPreSignedTx (api: ApiPromise, tx: string): void {
  const extrinsic = api.createType('Extrinsic', tx);

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  api.rpc.author.submitAndWatchExtrinsic(extrinsic, (result) => {
    console.log(stringify(result.toHuman(), 2));

    if (result.isInBlock || result.isFinalized) {
      process.exit(0);
    }
  });
}

export default async function cmdSubmit (account: string, blocks: number | undefined, endpoint: string, tx: string | undefined, [txName, ...params]: string[]): Promise<void> {
  const api = await ApiPromise.create({ provider: new WsProvider(endpoint) });

  if (tx) {
    return submitPreSignedTx(api, tx);
  }

  const options: Partial<SignerOptions> = { signer: new RawSigner() };

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

  await getTx(api, txName)(...params).signAndSend(account, options, (result): void => {
    console.log(stringify(result.toHuman(), 2));

    if (result.isInBlock || result.isFinalized) {
      process.exit(0);
    }
  });
}
