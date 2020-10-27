// Copyright 2018-2020 @polkadot/metadata-cmp authors & contributors
// SPDX-License-Identifier: Apache-2.0

import yargs from 'yargs';
import { ApiPromise, WsProvider } from '@polkadot/api';
import Decorated from '@polkadot/metadata/Decorated';
import { Metadata } from '@polkadot/types';
import { RuntimeVersion } from '@polkadot/types/interfaces';
import { assert, stringCamelCase } from '@polkadot/util';

const [ws1, ws2] = yargs.demandCommand(2).argv._;

function createLog (title: string, pre: string, text: string, post?: string, noPad?: boolean): string {
  return `${noPad ? title : (title ? `[${title}]` : '').padStart(40)}${pre ? ` ${pre}` : ''} ${text}${post ? ` (${post})` : ''}`;
}

function createCompare (title: string, pre: string, a: string | number = '-', b: string | number = '-', post?: string, noPad?: boolean): string {
  return createLog(title, pre, `${a === b ? a : `${a} -> ${b}`}`, post, noPad);
}

async function getMetadata (url: string): Promise<[Metadata, RuntimeVersion]> {
  assert(url.startsWith('ws://') || url.startsWith('wss://'), `Invalid WebSocket endpoint ${url}, expected ws:// or wss://`);

  const provider = new WsProvider(url);
  const api = await ApiPromise.create({ provider });

  provider.on('error', () => process.exit());

  return Promise.all([api.rpc.state.getMetadata(), api.rpc.state.getRuntimeVersion()]);
}

// our main entry point - from here we call out
async function main (): Promise<number> {
  const [metaA, verA] = await getMetadata(ws1);
  const [metaB, verB] = await getMetadata(ws2);
  const a = metaA.asLatest;
  const b = metaB.asLatest;

  console.log(createCompare('Spec', 'ver', verA.specVersion.toNumber(), verB.specVersion.toNumber()));
  console.log(createCompare('Metadata', 'ver', metaA.version, metaB.version));

  const mA = a.modules.map(({ name }) => name.toString());
  const mB = b.modules.map(({ name }) => name.toString());

  console.log(createCompare('Modules', 'num', mA.length, mB.length));

  const mAdd = mB.filter((m) => !mA.includes(m));
  const mDel = mA.filter((m) => !mB.includes(m));

  mAdd.length && console.log(createLog('+', '', mAdd.join(', ')));
  mDel.length && console.log(createLog('-', '', mDel.join(', ')));
  console.log();

  const decA = new Decorated(metaA.registry, metaA);
  const decB = new Decorated(metaB.registry, metaB);

  mA
    .filter((m) => mB.includes(m))
    .forEach((m): void => {
      const n = stringCamelCase(m);
      const eA = Object.keys(decA.tx[n] || {});
      const eB = Object.keys(decB.tx[n] || {});

      if (eA.length === eB.length && eA.length === 0) {
        return;
      }

      const count = createCompare('calls', '', eA.length, eB.length, undefined, true);

      console.log(createCompare(m, 'idx', decA.tx[n][eA[0]]?.callIndex[0], decB.tx[n][eB[0]]?.callIndex[0], count));

      const eAdd = eB.filter((e) => !eA.includes(e));
      const eDel = eA.filter((e) => !eB.includes(e));

      eAdd.length && console.log(createLog('+', '', eAdd.join(', ')));
      eDel.length && console.log(createLog('-', '', eDel.join(', ')));

      eA
        .filter((c) => eB.includes(c))
        .forEach((c): void => {
          const cA = decA.tx[n][c];
          const cB = decB.tx[n][c];
          const tA = cA.meta.args.map(({ type }) => type.toString());
          const tB = cB.meta.args.map(({ type }) => type.toString());
          const typeDiff = tA.length !== tB.length || tA.some((t, index) => tB[index] !== t);

          if (cA.callIndex[1] !== cB.callIndex[1] || typeDiff) {
            const params = createCompare('args', '', tA.length, tB.length, undefined, true);

            console.log(createCompare(c, 'idx', cA.callIndex[1], cB.callIndex[1], params));
            console.log(createCompare('', '', `(${tA.join(', ')})`, `(${tB.join(', ')})`));
          }
        });

      console.log();
    });

  return 0;
}

process.on('unhandledRejection', (error): void => {
  console.error(error);
  process.exit(1);
});

main()
  .then((code) => process.exit(code))
  .catch((error): void => {
    console.error(error);
    process.exit(1);
  });
