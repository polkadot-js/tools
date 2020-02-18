// Copyright 2018-2020 @polkadot/api-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { CallFunction, Codec } from '@polkadot/types/types';

import fs from 'fs';
import yargs from 'yargs';
import { ApiPromise, WsProvider, SubmittableResult } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { Text } from '@polkadot/types';
import { assert, isFunction } from '@polkadot/util';

// the function signature for our catch-any result logger
type LogFn = (result: SubmittableResult | Codec | ApiCallFn) => void;

// Assume that we know what we are doing where we use this - create a signature
// that combines the Extrinsic and normal calls into one as a result
interface ApiCallResult extends Promise<Codec> {
  signAndSend (addr: KeyringPair, cb: (result: SubmittableResult) => void): Promise<() => void>;
}

// As above, combine the normal calls (meta) with stuff exposed on extrinsics (description)
interface ApiCallFn {
  (...args: (string | LogFn)[]): CallFunction & ApiCallResult;
  description?: string;
  meta?: {
    documentation: Text[];
  };
}

// interface ApiExtSection
interface ApiExtSection {
  [index: string]: {
    [index: string]: ApiCallFn;
  };
}

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

const CRYPTO = ['ed25519', 'sr25519'];

const usage = `Usage: [options] <endpoint> <...params>
Example: query.system.account 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKv3gB
Example: query.substrate.code --info
Example: --seed "//Alice" tx.balances.transfer F7Gh 10000`;

// retrieve and parse arguments - we do this globally, since this is a single command
const {
  _: [endpoint, ...paramsInline],
  info,
  params: paramsFile,
  seed,
  sign,
  sub,
  ws,
  sudo
} = yargs
  .command('$0', usage)
  .middleware((argv) => {
    argv._ = argv._.map((param) => {
      try {
        return JSON.parse(param);
      } catch (err) {
        return param;
      }
    });
    return argv;
  })
  .wrap(120)
  .options({
    info: {
      description: 'Shows the meta information for the call',
      type: 'boolean'
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
    params: {
      description: 'Location of file containing space-separated transaction parameters (optional)',
      type: 'string'
    },
    ws: {
      default: 'ws://127.0.0.1:9944',
      description: 'The API endpoint to connect to, e.g. wss://poc3-rpc.polkadot.io',
      type: 'string',
      required: true
    },
    sudo: {
      description: 'Run this tx as a wrapped sudo.sudo call',
      type: 'boolean'
    }
  })
  .strict()
  .argv;

let params: string[];
if (paramsFile) {
  assert(fs.existsSync(paramsFile), 'Cannot find supplied transaction parameters file');

  try {
    const contents = fs.readFileSync(paramsFile, 'utf8');

    params = contents.split(' ');
  } catch (e) {
    assert(false, 'Error loading supplied transaction parameters file');
  }
} else {
  params = paramsInline;
}

// a parameter whose initial character is @ treated as a path and replaced
// with the hexadecimal representation of the binary contents of that file
params = params.map(param => {
  if (param.startsWith('@')) {
    const path = param.substring(1);
    assert(fs.existsSync(path), `Cannot find path ${path}`);
    const data = fs.readFileSync(path).toString('hex');
    return `0x${data}`;
  }
  return param;
});

// parse the arguments and retrieve the details of what we want to do
async function getCallInfo (): Promise<CallInfo> {
  assert(endpoint && endpoint.includes('.'), 'You need to specify the command to execute, e.g. query.system.account');

  const provider = new WsProvider(ws);
  const api = await ApiPromise.create({ provider });
  const apiExt = api as unknown as ApiExt;
  const [type, section, method] = endpoint.split('.') as [keyof ApiExt, string, string];

  assert(['consts', 'derive', 'query', 'rpc', 'tx'].includes(type), `Expected one of consts, derive, query, rpc, tx, found ${type}`);
  assert(apiExt[type][section], `Cannot find ${type}.${section}`);
  assert(apiExt[type][section][method], `Cannot find ${type}.${section}.${method}`);

  const fn = apiExt[type][section][method];

  return {
    api,
    fn,
    log: (result: SubmittableResult | Codec | ApiCallFn): void => console.log(
      JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/unbound-method
        [method]: isFunction((result as Codec).toHuman)
          ? (result as Codec).toHuman()
          : result
      }, null, 2)
    ),
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
    meta.documentation.forEach((doc: Text): void =>
      console.log(doc.toString())
    );
  } else {
    console.log('No documentation available');
  }

  // Empty line at the end to make it pretty
  console.log();

  process.exit(0);
}

// send a transaction
async function makeTx ({ fn, log, api }: CallInfo): Promise<() => void> {
  assert(seed, 'You need to specify an account seed with tx.*');
  assert(CRYPTO.includes(sign), `The crypto type can only be one of ${CRYPTO.join(', ')} found '${sign}'`);

  const keyring = new Keyring();
  const auth = keyring.createFromUri(seed, {}, sign as 'ed25519');
  let signable;

  if (sudo) {
    const adminId = await api.query.sudo.key();

    assert(adminId.eq(auth.address), 'Supplied seed does not match on-chain sudo key');

    signable = api.tx.sudo.sudo(fn(...params));
  } else {
    signable = fn(...params);
  }

  return signable.signAndSend(auth, (result: SubmittableResult): void => {
    log(result);

    if (result.isInBlock || result.isFinalized) {
      process.exit(0);
    }
  });
}

// make a derive, query or rpc call
async function makeCall ({ fn, log, method, type }: CallInfo): Promise<void> {
  const isRpcSub = (type === 'rpc') && method.startsWith('subscribe');

  return sub || isRpcSub
    ? fn(...params, log).then((): void => {
      // ignore, we keep trucking on
    })
    : fn(...params).then(log).then((): void => {
      process.exit(0);
    });
}

// our main entry point - from here we call out
async function main (): Promise<void | (() => void)> {
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

main().catch((error): void => {
  console.error(error);

  process.exit(1);
});
