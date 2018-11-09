const config = require('@polkadot/dev/config/jest');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@polkadot/monitor-(rpc)(.*)$': '<rootDir>/packages/monitor-$1/src/$2'
  }
});
