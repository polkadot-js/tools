// Copyright 2018-2020 @polkadot/json-serve authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingElected } from '@polkadot/api-derive/types';
import { Balance, BlockNumber, Header } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import Koa from 'koa';
import koaRoute from 'koa-route';
import yargs from 'yargs';
import { ApiPromise, WsProvider } from '@polkadot/api';

const { port, ws } = yargs
  .options({
    port: {
      default: 9099,
      description: 'The HTTP port to listen on',
      required: true,
      type: 'number'
    },
    ws: {
      description: 'The endpoint to connect to, e.g. wss://kusama-rpc.polkadot.io',
      required: true,
      type: 'string'
    }
  })
  .argv;

let currentBlockNumber: BlockNumber | undefined;
let currentTimestamp: Date = new Date();
let tokenDecimals = 12;
let totalBonded = new BN(0);
let totalInsurance = new BN(0);

function balanceFormat (balance: BN): string {
  if (balance.gtn(0)) {
    const strValue = balance.toString().padStart(tokenDecimals + 1, '0');
    const postfix = strValue.slice(-1 * tokenDecimals);
    const prefix = strValue.slice(0, strValue.length - tokenDecimals);

    return `${prefix}.${postfix}`;
  }

  return '0.0';
}

function percentageFormat (top: BN, bottom: BN): string {
  if (top.gtn(0) && bottom.gtn(0)) {
    return (top.muln(10000).div(bottom).toNumber() / 100).toFixed(2);
  }

  return '0.00';
}

function onElectedInfo (info: DeriveStakingElected): void {
  totalBonded = info.info.reduce((totalBonded, { exposure }): BN => {
    return totalBonded.add(exposure?.total.unwrap() || new BN(0));
  }, new BN(0));
}

function onNewHead (header: Header): void {
  if (currentBlockNumber && header.number.eq(currentBlockNumber.toBn())) {
    return;
  }

  currentBlockNumber = header.number.unwrap();
  currentTimestamp = new Date();

  console.log(`#${currentBlockNumber.toString()} received at ${currentTimestamp.toString()}`);
}

function onTotalInsurance (_totalInsurance: Balance): void {
  totalInsurance = _totalInsurance;
}

function jsonApi (ctx: Koa.Context): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  switch (ctx.query.q) {
    case 'bondedpercentage':
      ctx.body = percentageFormat(totalBonded, totalInsurance);
      break;

    case 'totalbonded':
      ctx.body = balanceFormat(totalBonded);
      break;

    case 'totalcoins':
      ctx.body = balanceFormat(totalInsurance);
      break;

    default:
      ctx.body = "Error: Invalid query, expected '?q=<type>', one of 'bondedpercentage', 'totalbonded', 'totalcoins'";
      break;
  }
}

async function main (): Promise<void> {
  const app = new Koa();

  app.use(koaRoute.all('/', jsonApi));
  app.listen(port);

  const provider = new WsProvider(ws);
  const api = await ApiPromise.create({ provider });
  const chainProperties = await api.rpc.system.properties();

  tokenDecimals = chainProperties.tokenDecimals.unwrapOr(new BN(12)).toNumber();

  await api.rpc.chain.subscribeNewHeads(onNewHead);
  await api.query.balances.totalIssuance(onTotalInsurance);
  await api.derive.staking.electedInfo(onElectedInfo);
}

main().catch((error): void => {
  console.error(error);

  process.exit(1);
});
