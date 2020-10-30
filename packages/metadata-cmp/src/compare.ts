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

      const sA = Object.keys(decA.query[n] || {});
      const sB = Object.keys(decB.query[n] || {});
      
      if (sA.length === sB.length && sA.length === 0) {
        return;
      }
      
      const count = createCompare('calls', '', eA.length, eB.length, undefined, true);
      const storage = createCompare('storage', '', sA.length, sB.length, undefined, true);
      const post = `${count}, ${storage}`;

      console.log(createCompare(m, 'idx', decA.tx[n][eA[0]]?.callIndex[0], decB.tx[n][eB[0]]?.callIndex[0], post));

      const eAdd = eB.filter((e) => !eA.includes(e));
      const eDel = eA.filter((e) => !eB.includes(e));

      eAdd.length && console.log(createLog('+ calls', '', eAdd.join(', ')));
      eDel.length && console.log(createLog('- calls', '', eDel.join(', ')));

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
      
      const sAdd = sB.filter((e) => !sA.includes(e));
      const sDel = sA.filter((e) => !sB.includes(e));

      sAdd.length && console.log(createLog('+ storage', '', sAdd.join(', ')));
      sDel.length && console.log(createLog('- storage', '', sDel.join(', ')));

      sA
        .filter((c) => sB.includes(c))
        .forEach((c): void => {
          const cA = decA.query[n][c];
          const cB = decB.query[n][c];

          // storage types differ
          if (!cA.meta.type.eq(cB.meta.type)) {
            // diff map
            if (cA.meta.type.isMap && cB.meta.type.isMap) {
              let mapA = cA.meta.type.asMap;
              let mapB = cB.meta.type.asMap;
              let diffs = [];
              if (!mapA.hasher.eq(mapB.hasher)) {
                diffs.push(createCompare('hasher', '', mapA.hasher.toString(), mapB.hasher.toString(), undefined, true));
              }
              if (!mapA.key.eq(mapB.key)) {
                diffs.push(createCompare('key', '', mapA.key.toString(), mapB.key.toString(), undefined, true));
              }
              if (!mapA.value.eq(mapB.value)) {
                diffs.push(createCompare('value', '', mapA.value.toString(), mapB.value.toString(), undefined, true));
              }
              if (diffs.length > 0) {
                console.log(createLog(c, diffs.shift() || '', ''));
                for (let diff of diffs) {
                  console.log(createLog('', diff, ''));
                }
              }
            }
            // diff double map
            else if (cA.meta.type.isDoubleMap && cB.meta.type.isDoubleMap) {
              let mapA = cA.meta.type.asDoubleMap;
              let mapB = cB.meta.type.asDoubleMap;
              let diffs = [];
              if (!mapA.hasher.eq(mapB.hasher)) {
                diffs.push(createCompare('hasher', '', mapA.hasher.toString(), mapB.hasher.toString(), undefined, true));
              }
              if (!mapA.key1.eq(mapB.key1)) {
                diffs.push(createCompare('key1', '', mapA.key1.toString(), mapB.key1.toString(), undefined, true));
              }
              if (!mapA.key2Hasher.eq(mapB.key2Hasher)) {
                diffs.push(createCompare('key2Hasher', '', mapA.key2Hasher.toString(), mapB.key2Hasher.toString(), undefined, true));
              }
              if (!mapA.key2.eq(mapB.key2)) {
                diffs.push(createCompare('key2', '', mapA.key2.toString(), mapB.key2.toString(), undefined, true));
              }
              if (!mapA.value.eq(mapB.value)) {
                diffs.push(createCompare('value', '', mapA.value.toString(), mapB.value.toString(), undefined, true));
              }
              if (diffs.length > 0) {
                console.log(createLog(c, diffs.shift() || '', ''));
                for (let diff of diffs) {
                  console.log(createLog('', diff, ''));
                }
              }
            }
            // diff plain type
            else if (cA.meta.type.isPlain && cB.meta.type.isPlain) {
              let tA = cA.meta.type.asPlain;
              let tB = cB.meta.type.asPlain;
              console.log(createCompare(c, 'type', tA.toString(), tB.toString(), undefined));
            }
            // fallback diff if types are completely different
            else {
              console.log(createLog(c, cA.meta.type.toString(), ''));
              console.log(createLog('', "->", ''));
              console.log(createLog('', cB.meta.type.toString(), ''));
            }
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
