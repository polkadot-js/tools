// Copyright 2018-2020 @polkadot/api-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, SubmittableResult, WsProvider } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { Codec } from '@polkadot/types/types';
import { assert } from '@polkadot/util';
import yargs from 'yargs';

// import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
const testKeyring = require('@polkadot/keyring/testing');

// the function signature for our catch-any result logger
type LogFn = (result: SubmittableResult | Codec | ApiCallFn) => void;

// Assume that we know what we are doing where we use this - create a signature
// that combines the Extrinsic and normal calls into one as a result
interface ApiCallResult extends Promise<Codec> {
  signAndSend(addr: KeyringPair, cb: (result: SubmittableResult) => void): Promise<void>;
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
}

const CRYPTO = ['ed25519', 'sr25519'];

const usage = `Usage: [options] <endpoint> <...params>
Example: system.setCode $(xxd -p test.wasm | tr -d $'\n' | xargs printf '0x%s')`;

// retrieve and parse arguments - we do this globally, since this is a single command
const { _: [endpoint, ...params], ws } = yargs
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
async function getCallInfo(): Promise<CallInfo> {
  assert(endpoint && endpoint.includes('.'), 'You need to specify the command to execute, e.g. system.setCode');

  const provider = new WsProvider(ws);
  const api = (await ApiPromise.create({ provider })) as unknown as ApiExt;
  const [section, method] = endpoint.split('.') as [string, string];

  assert(api['tx'][section], `Cannot find tx.${section}`);
  assert(api['tx'][section][method], `Cannot find tx.${section}.${method}`);

  const fn = api['tx'][section][method];

  return {
    fn,
    log: (result: SubmittableResult | Codec | ApiCallFn): void =>
      console.log(JSON.stringify({ [method]: result }, null, 2)),
    method,
    section
  };
}

// retrieve consts
function logConst({ fn, log }: CallInfo): void {
  log(fn);

  process.exit(0);
}

// log the details of a specific endpoint
function logDetails({ fn: { description, meta }, method, section }: CallInfo): void {
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
async function makeTx({ fn, log }: CallInfo): Promise<void> {
  const provider = new WsProvider(ws);
  const api = await ApiPromise.create({ provider });
  const adminId = await api.query.sudo.key();
  const keyring = testKeyring.default();
  const adminPair = keyring.getPair(adminId.toString());

  return api.tx.sudo.sudo(fn(...params)).signAndSend(adminPair, (result: SubmittableResult): void => {
    log(result);

    if (result.isInBlock || result.isFinalized) {
      process.exit(0);
    }
  });
}

// our main entry point - from here we call out
async function main(): Promise<void> {
  const callInfo = await getCallInfo();
  return makeTx(callInfo);
}

main().catch((error): void => {
  console.error(error);

  process.exit(1);
});
