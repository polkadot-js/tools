// Copyright 2018-2021 @polkadot/metadata-cmp authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RuntimeVersion } from '@polkadot/types/interfaces';

import yargs from 'yargs';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { expandMetadata, Metadata } from '@polkadot/types';
import { getSiName } from '@polkadot/types/metadata/util';
import { unwrapStorageType } from '@polkadot/types/primitive/StorageKey';
import { assert, stringCamelCase } from '@polkadot/util';

type ArgV = { _: [string, string] };

const [ws1, ws2] = (yargs.demandCommand(2).argv as unknown as ArgV)._;

function chunk (array: string[], size: number): string[][] {
  const chunked = [];
  const copied = [...array];
  const numOfChild = Math.ceil(copied.length / size);

  for (let i = 0; i < numOfChild; i++) {
    chunked.push(copied.splice(0, size));
  }

  return chunked;
}

function log (pad: number, title: string, pre: string, text: string, post?: string) {
  console.log(createLog(pad, title, pre, text, post));
}

function createLog (pad: number, title: string, pre: string, text: string, post?: string): string {
  const titleStr = pad > 0 ? (title ? `[${title}]` : '') : title;

  return `${titleStr.padStart(pad)}${pre ? ` ${pre}` : ''} ${text}${post ? ` (${post})` : ''}`;
}

function createCompare (a: string | number = '-', b: string | number = '-'): string {
  return `${a === b ? a : `${a} -> ${b}`}`;
}

function logArray (pad: number, title: string, pre: string, arr: string[], chunkSize: number) {
  if (arr.length) {
    let first = true;

    for (const ch of chunk(arr, chunkSize)) {
      console.log(createLog(pad, first ? title : '', first ? pre : '', ch.join(', ')));
      first = false;
    }
  }
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
  // configure padding
  const lvlInc = 14;
  const deltaInc = 4;
  const lvl1 = 20;
  const lvl2 = lvl1 + lvlInc;
  const lvl3 = lvl1 + 2 * lvlInc;
  const lvl5 = lvl1 + 4 * lvlInc;
  const chunkSize = 5;

  log(lvl1, 'Spec', 'version:', createCompare(verA.specVersion.toNumber(), verB.specVersion.toNumber()));
  log(lvl1, 'Metadata', 'version:', createCompare(metaA.version, metaB.version));

  const mA = a.pallets.map(({ name }) => name.toString());
  const mB = b.pallets.map(({ name }) => name.toString());

  log(lvl1, 'Modules', 'num:', createCompare(mA.length, mB.length));

  const mAdd = mB.filter((m) => !mA.includes(m));
  const mDel = mA.filter((m) => !mB.includes(m));

  logArray(lvl1 + deltaInc, '+', 'modules:', mAdd, chunkSize);
  logArray(lvl1 + deltaInc, '-', 'modules:', mDel, chunkSize);
  console.log();

  const decA = expandMetadata(metaA.registry, metaA);
  const decB = expandMetadata(metaB.registry, metaB);

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

      const count = createCompare(eA.length, eB.length);
      const storage = createCompare(sA.length, sB.length);
      const post = `calls: ${count}, storage: ${storage}`;
      const index = createCompare(decA.tx[n][eA[0]]?.callIndex[0], decB.tx[n][eB[0]]?.callIndex[0]);

      log(lvl2, m, 'idx:', index, post);

      const eAdd = eB.filter((e) => !eA.includes(e));
      const eDel = eA.filter((e) => !eB.includes(e));

      logArray(lvl2 + deltaInc, '+', 'calls:', eAdd, chunkSize);
      logArray(lvl2 + deltaInc, '-', 'calls:', eDel, chunkSize);

      eA
        .filter((c) => eB.includes(c))
        .forEach((c): void => {
          const cA = decA.tx[n][c];
          const cB = decB.tx[n][c];
          const tA = cA.meta.args.map(({ type }) => type.toString());
          const tB = cB.meta.args.map(({ type }) => type.toString());
          const typeDiff = tA.length !== tB.length || tA.some((t, index) => tB[index] !== t);

          if (cA.callIndex[1] !== cB.callIndex[1] || typeDiff) {
            const params = `args: ${createCompare(tA.length, tB.length)}`;

            log(lvl3, c, 'idx:', createCompare(cA.callIndex[1], cB.callIndex[1]), params);
            const signature = createCompare(`(${tA.join(', ')})`, `(${tB.join(', ')})`);

            if (signature !== '()') {
              log(lvl3, '', '', signature);
            }
          }
        });
      const sAdd = sB.filter((e) => !sA.includes(e));
      const sDel = sA.filter((e) => !sB.includes(e));

      logArray(lvl2 + deltaInc, '+', 'storage:', sAdd, 5);
      logArray(lvl2 + deltaInc, '-', 'storage:', sDel, 5);

      sA
        .filter((c) => sB.includes(c))
        .forEach((c): void => {
          const cA = decA.query[n][c];
          const cB = decB.query[n][c];
          const tA = unwrapStorageType(metaA.registry, cA.meta.type, cA.meta.modifier.isOptional);
          const tB = unwrapStorageType(metaB.registry, cB.meta.type, cB.meta.modifier.isOptional);

          // storage types differ
          if (tA !== tB) {
            if (cA.meta.type.isMap && cB.meta.type.isMap) {
              // diff map
              const mapA = cA.meta.type.asMap;
              const mapB = cB.meta.type.asMap;
              const diffs = [];
              const hA = mapA.hashers.map((h) => h.toString()).join(', ');
              const hB = mapB.hashers.map((h) => h.toString()).join(', ');

              if (hA !== hB) {
                diffs.push(`hashers: ${createCompare(hA, hB)}`);
              }

              const kA = (
                mapA.hashers.length === 1
                  ? [mapA.key]
                  : metaA.registry.lookup.getSiType(mapA.key).def.asTuple
              ).map((t) => getSiName(metaA.registry.lookup, t)).join(', ');
              const kB = (
                mapB.hashers.length === 1
                  ? [mapB.key]
                  : metaB.registry.lookup.getSiType(mapB.key).def.asTuple
              ).map((t) => getSiName(metaB.registry.lookup, t)).join(', ');

              if (kA !== kB) {
                diffs.push(`keys: ${createCompare(kA, kB)}`);
              }

              const vA = getSiName(metaA.registry.lookup, mapA.value);
              const vB = getSiName(metaB.registry.lookup, mapB.value);

              if (vA !== vB) {
                diffs.push(`value: ${createCompare(vA, vB)}`);
              }

              logArray(lvl3, c, '', diffs, 1);
            } else if (cA.meta.type.isPlain && cB.meta.type.isPlain) {
              // diff plain type
              log(lvl3, c, 'type:', createCompare(tA, tB));
            } else {
              // fallback diff if types are completely different
              log(lvl3, c, '', tA);
              log(lvl5, '', '', '->');
              log(lvl3, '', '', tB);
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
