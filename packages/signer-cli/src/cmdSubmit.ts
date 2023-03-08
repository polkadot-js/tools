// Copyright 2018-2023 @polkadot/signer-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignerOptions } from '@polkadot/api/submittable/types';
import type { ExtrinsicStatus } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { stringify } from '@polkadot/util';

import RawSigner from './RawSigner.js';
import { getTx, mortalityOpts } from './util.js';

function watchResult (result: ExtrinsicStatus | ISubmittableResult): void {
  console.log(stringify(result.toHuman(), 2));

  if (result.isInBlock || result.isFinalized) {
    process.exit(0);
  }
}

export default async function cmdSubmit (account: string, blocks: number | undefined, endpoint = '', tx: string | undefined, [txName, ...params]: string[]): Promise<void> {
  const api = await ApiPromise.create({ provider: new WsProvider(endpoint) });

  if (tx) {
    await api.rpc.author.submitAndWatchExtrinsic(api.createType('Extrinsic', tx), watchResult);

    return;
  }

  const options: Partial<SignerOptions> = { signer: new RawSigner() };

  if (blocks === 0) {
    options.era = 0;
  } else if (blocks != null) {
    await mortalityOpts(api, options, blocks);
  }

  await getTx(api, txName)(...params).signAndSend(account, options, watchResult);
}
