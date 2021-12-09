// Copyright 2018-2021 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignerOptions } from '@polkadot/api/submittable/types';
import type { ExtrinsicStatus } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert, stringify } from '@polkadot/util';

import RawSigner from './RawSigner';

function watchResult (result: ExtrinsicStatus | ISubmittableResult): void {
  console.log(stringify(result.toHuman(), 2));

  if (result.isInBlock || result.isFinalized) {
    process.exit(0);
  }
}

export default async function cmdSubmit (account: string, blocks: number | undefined, endpoint: string, tx: string | undefined, [txName, ...params]: string[]): Promise<void> {
  const api = await ApiPromise.create({ provider: new WsProvider(endpoint) });

  if (tx) {
    await api.rpc.author.submitAndWatchExtrinsic(api.createType('Extrinsic', tx), watchResult);

    return;
  }

  const [section, method] = txName.split('.');

  assert(api.tx[section] && api.tx[section][method], `Unable to find method ${section}.${method}`);

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

  await api.tx[section][method](...params).signAndSend(account, options, watchResult);
}
