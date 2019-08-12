// Copyright 2019 @polkadot/api-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { Codec } from '@polkadot/types/types';

import yargs from 'yargs';
import { ApiPromise, WsProvider, SubmittableResult } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { assert } from '@polkadot/util';

// the function signature for our catch-any result logger
type LogFn = (result: SubmittableResult | Codec | ApiCallFn) => void;

// Assume that we know what we are doing where we use this - create a signature
// that combines the Extrinsic and normal calls into one as a result
interface ApiCallResult extends Promise<Codec> {
  signAndSend (addr: KeyringPair, cb: (result: SubmittableResult) => void): Promise<void>;
}

// As above, combine the normal calls (meta) with stuff exposed on extrinsics (description)
interface ApiCallFn {
  (...args: (string | LogFn)[]): ApiCallResult;
  description?: string;
  meta?: {
    documentation: string[];
  };
}

// interface ApiExtSection
interface ApiExtSection {
  [index: string]: {
    [index: string]: ApiCallFn;
  };
}

// extend out API definition to know about how we decorate the methods - we are really hacking
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
  fn: ApiCallFn;
  log: LogFn;
  method: string;
  section: string;
  type: string;
}

const CRYPTO = ['ed25519', 'sr25519'];

// retrieve and parse arguments - we do this globally, since this is a single command
const { _: [endpoint, ...params], info, seed, sign, sub, ws } = yargs
  .usage('Usage: [options] <endpoint> <...params>')
  .usage('Example: query.balances.freeBalance 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKv3gB')
  .usage('Example: query.substrate.code --info')
  .usage('Example: --seed "//Alice" tx.balances.transfer F7Gh 10000')
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
    ws: {
      default: 'ws://127.0.0.1:9944',
      description: 'The API endpoint to connect to, e.g. wss://poc3-rpc.polkadot.io',
      type: 'string',
      required: true
    }
  })
  .strict()
  .argv;

// parse the arguments and retrieve the details of what we want to do
async function getCallInfo (): Promise<CallInfo> {
  assert(endpoint && endpoint.indexOf('.') !== -1, `You need to specify the command to execute, e.g. query.balances.freeBalance`);

  const provider = new WsProvider(ws);
  const api = (await ApiPromise.create({ provider })) as unknown as ApiExt;
  const [type, section, method] = endpoint.split('.') as [keyof ApiExt, string, string];

  assert(['consts', 'derive', 'query', 'rpc', 'tx'].includes(type), `Expected one of consts, derive, query, rpc, tx, found ${type}`);
  assert(api[type][section], `Cannot find ${type}.${section}`);
  assert(api[type][section][method], `Cannot find ${type}.${section}.${method}`);

  const fn = api[type][section][method];

  return {
    fn,
    log: (result: SubmittableResult | Codec | ApiCallFn): void =>
      console.log(JSON.stringify({ [method]: result }, null, 2)),
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
    meta.documentation.forEach((doc: string): void =>
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
async function makeTx ({ fn, log }: CallInfo): Promise<void> {
  assert(seed, 'You need to specify an account seed with tx.*');
  assert(CRYPTO.includes(sign), `The crypto type can only be one of ${CRYPTO.join(', ')} found '${sign}'`);

  const keyring = new Keyring();
  const account = keyring.createFromUri(seed as string, {}, sign as 'ed25519');

  return fn(...params).signAndSend(account, (result: SubmittableResult): void => {
    log(result);

    if (result.isFinalized) {
      process.exit(0);
    }
  });
}

// make a derive, query or rpc call
async function makeCall ({ fn, log, method, type }: CallInfo): Promise<void> {
  const isRpcSub = (type === 'rpc') && (method.indexOf('subscribe') === 0);

  return sub || isRpcSub
    ? fn(...params, log).then((): void => {
      // ignore, we keep trucking on
    })
    : fn(...params).then(log).then((): void => {
      process.exit(0);
    });
}

// our main entry point - from here we call out
async function main (): Promise<void> {
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
  console.error('ERROR:', error.message);

  process.exit(1);
});
