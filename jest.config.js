// Copyright 2018-2020 @polkadot/tools authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const config = require('@polkadot/dev/config/jest');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@polkadot/api-cli(.*)$': '<rootDir>/packages/api-cli/src/$1',
    '@polkadot/monitor-rpc(.*)$': '<rootDir>/packages/monitor-rpc/src/$1'
  }
});
