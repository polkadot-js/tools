// Copyright 2018-2023 @polkadot/tools authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

module.exports = {
  ...config,
  moduleNameMapper: {
    '@polkadot/api-cli(.*)$': '<rootDir>/packages/api-cli/src/$1',
    '@polkadot/monitor-rpc(.*)$': '<rootDir>/packages/monitor-rpc/src/$1'
  }
};
