// Copyright 2018-2024 @polkadot/api-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment/substrate';

import type { SubmittableResult } from '@polkadot/api';
import type { ApiOptions, SignerOptions } from '@polkadot/api/types';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { CallFunction, Codec } from '@polkadot/types/types';
import type { KeypairType } from '@polkadot/util-crypto/types';

import fs from 'node:fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { assert, isCodec, stringify } from '@polkadot/util';

import { hexMiddleware, jsonMiddleware, parseParams } from './cli.js';

// the function signature for our catch-any result logger
// eslint-disable-next-line no-use-before-define
type LogFn = (result: SubmittableResult | Codec | ApiCallFn) => void;

// Assume that we know what we are doing where we use this - create a signature
// that combines the Extrinsic and normal calls into one as a result
interface ApiCallResult extends Promise<Codec> {
  signAndSend (addr: KeyringPair, cb: (result: SubmittableResult) => void): Promise<() => void>;

  signAndSend (addr: KeyringPair, options: Partial<SignerOptions>, cb: (result: SubmittableResult) => void): Promise<() => void>;
}

// As above, combine the normal calls (meta) with stuff exposed on extrinsics (description)
interface ApiCallFn {
  (...args: (string | LogFn)[]): CallFunction & ApiCallResult;
  description?: string;
  meta?: {
    docs: Text[];
  };
}

// interface ApiExtSection
type ApiExtSection = Record<string, Record<string, ApiCallFn>>;

// extend our API definition to know about how we decorate the methods - we are really hacking
// into the API definitions here a bit since we want to dynamically access the endpoints
interface ApiExt {
  consts: ApiExtSection;
  derive: ApiExtSection;
  query: ApiExtSection;
  rpc: ApiExtSection;
  tx: ApiExtSection;
}

// the info extracted from the actual params provided
interface CallInfo {
  api: ApiPromise;
  fn: ApiCallFn;
  log: LogFn;
  method: string;
  section: string;
  type: string;
}

interface Params {
  _: string[];
  info: boolean;
  noWait: boolean;
  nonce: number;
  params: string;
  rpc: string;
  seed: string;
  sign: string;
  sub: boolean;
  sudo: boolean;
  sudoUncheckedWeight: string,
  types: string;
  ws: string;
  assetId: number;
  tip: number;
}

const CRYPTO = ['ed25519', 'sr25519', 'ethereum', 'ecdsa'];

// retrieve and parse arguments - we do this globally, since this is a single command
const argv = yargs(hideBin(process.argv))
  .parserConfiguration({
    'parse-numbers': false,
    'parse-positional-numbers': false
  })
  .command('$0', `Usage: [options] <endpoint> <...params>
Example: query.system.account 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKv3gB
Example: query.substrate.code --info
Example: --seed "//Alice" tx.balances.transfer F7Gh 10000
Example: --seed "//Alice" --noWait --nonce -1 tx.balances.transfer F7Gh 10000`
  )
  .middleware(hexMiddleware)
  .middleware(jsonMiddleware)
  .wrap(120)
  .options({
    assetId: {
      description: 'The asset id to add to the transaction for payment',
      type: 'number'
    },
    info: {
      description: 'Shows the meta information for the call',
      type: 'boolean'
    },
    noWait: {
      description: 'After sending a tx return immediately and don\'t wait until it is included in a block',
      type: 'boolean'
    },
    nonce: {
      description: 'An account nonce to be used when signing tx. -1 means to read it from node (including tx pool)',
      type: 'number'
    },
    params: {
      description: 'Location of file containing space-separated transaction parameters (optional)',
      type: 'string'
    },
    rpc: {
      description: 'Add this .json file as RPC types to the API constructor',
      type: 'string'
    },
    seed: {
      description: 'The account seed to use (required for tx.* only)',
      type: 'string'
    },
    sign: {
      choices: CRYPTO,
      default: 'sr25519',
      description: 'The account crypto signature to use (required fo tx.* only)',
      type: 'string'
    },
    sub: {
      description: 'With this flag set, perform subscription, running until exited with ^C',
      type: 'boolean'
    },
    sudo: {
      description: 'Run this tx as a wrapped sudo.sudo call',
      type: 'boolean'
    },
    sudoUncheckedWeight: {
      description: 'Run this tx as a wrapped sudo.sudoUncheckedWeight call with weight',
      type: 'string'
    },
    tip: {
      description: 'Add a tip to the transction for the block author',
      type: 'number'
    },
    types: {
      description: 'Add this .json file as types to the API constructor',
      type: 'string'
    },
    ws: {
      default: 'ws://127.0.0.1:9944',
      description: 'The API endpoint to connect to, e.g. wss://kusama-rpc.polkadot.io',
      required: true,
      type: 'string'
    }
  })
  .argv as Params;

const { _: [endpoint, ...paramsInline], assetId, info, noWait, nonce, params: paramsFile, seed, sign, sub, sudo, sudoUncheckedWeight, tip, ws } = argv;
const params = parseParams(paramsInline, paramsFile);

const ALLOWED = ['consts', 'derive', 'query', 'rpc', 'tx'];

function readFile <T> (src: string): NonNullable<T> {
  if (!src) {
    return {} as NonNullable<T>;
  }

  assert(fs.existsSync(src), `Unable to read .json file at ${src}`);

  return JSON.parse(fs.readFileSync(src, 'utf8')) as NonNullable<T>;
}

// parse the arguments and retrieve the details of what we want to do
async function getCallInfo (): Promise<CallInfo> {
  assert(endpoint && endpoint.includes('.'), 'You need to specify the command to execute, e.g. query.system.account');

  const rpc = readFile<ApiOptions['rpc']>(argv.rpc);
  const types = readFile<ApiOptions['types']>(argv.types);
  const provider = new WsProvider(ws);
  const api = await ApiPromise.create({ provider, rpc, types });
  const apiExt = (api as unknown) as ApiExt;
  const [type, section, method] = endpoint.split('.') as [keyof ApiExt, string, string];

  assert(ALLOWED.includes(type), `Expected one of ${ALLOWED.join(', ')}, found ${type}`);
  assert(apiExt[type][section], `Cannot find ${type}.${section}, your chain does not have the ${section} pallet exposed in the runtime`);

  const fn = apiExt[type][section][method];

  assert(fn, `Cannot find ${type}.${section}.${method}, your chain doesn't have the ${method} exposed in the ${section} pallet`);

  return {
    api,
    fn,
    log: (result: SubmittableResult | Codec | ApiCallFn): void =>
      console.log(stringify({
        [method]: isCodec(result)
          ? result.toHuman()
          : result
      }, 2)),
    method,
    section,
    type
  };
}

// retrieve consts
function logConst ({ fn, log }: CallInfo): void {
  log(fn);
  process.exit(0);
}

// log the details of a specific endpoint
function logDetails ({ fn: { description, meta }, method, section }: CallInfo): void {
  console.log(`# ${section}.${method}\n`);

  if (description) {
    console.log(description);
  } else if (meta) {
    // We actually override all toString() methods inside the API, so this
    // is safe, aka won't display `[Object object]`
    //
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    meta.docs.forEach((d) => console.log(d.toString()));
  } else {
    console.log('No documentation available');
  }

  // Empty line at the end to make it pretty
  console.log();
  process.exit(0);
}

function isCrypto (type: string): type is KeypairType {
  return CRYPTO.includes(type);
}

// send a transaction
async function makeTx ({ api, fn, log }: CallInfo): Promise<(() => void) | Hash> {
  assert(seed, 'You need to specify an account seed with tx.*');
  assert(isCrypto(sign), `The crypto type can only be one of ${CRYPTO.join(', ')} found '${sign}'`);

  const keyring = new Keyring();
  const signer = keyring.createFromUri(seed, {}, sign);
  let signable;

  if (sudo || sudoUncheckedWeight) {
    const adminId = await api.query.sudo.key();

    assert(adminId.eq(signer.address), 'Supplied seed does not match on-chain sudo key');

    signable = sudoUncheckedWeight
      ? api.tx.sudo.sudoUncheckedWeight(fn(...params), sudoUncheckedWeight)
      : api.tx.sudo.sudo(fn(...params));
  } else {
    signable = fn(...params);
  }

  return signable.signAndSend(signer, { assetId, nonce, tip }, (result: SubmittableResult): void => {
    log(result);

    if (noWait || result.isInBlock || result.isFinalized) {
      process.exit(0);
    }
  });
}

// make a derive, query or rpc call
// eslint-disable-next-line @typescript-eslint/require-await
async function makeCall ({ fn, log, method, type }: CallInfo): Promise<void> {
  const isRpcSub = type === 'rpc' && method.startsWith('subscribe');

  return sub || isRpcSub
    ? fn(...params, log).then((): void => {
      // ignore, we keep trucking on
    })
    : fn(...params)
      .then(log)
      .then((): void => {
        process.exit(0);
      });
}

// our main entry point - from here we call out
async function main (): Promise<void | Hash | (() => void)> {
  const callInfo = await getCallInfo();

  if (info) {
    return logDetails(callInfo);
  } else if (callInfo.type === 'consts') {
    return logConst(callInfo);
  } else if (callInfo.type === 'tx') {
    return makeTx(callInfo);
  }

  return makeCall(callInfo);
}

process.on('unhandledRejection', (error): void => {
  console.error(error);
  process.exit(1);
});

main().catch((error): void => {
  console.error(error);

  process.exit(1);
});
