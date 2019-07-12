/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('@polkadot/dev/config/jest');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@polkadot/api-cli(.*)$': '<rootDir>/packages/api-cli/src/$1',
    '@polkadot/monitor-rpc(.*)$': '<rootDir>/packages/monitor-rpc/src/$1'
  }
});
