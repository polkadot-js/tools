module.exports = {
  extends: '@polkadot/dev/config/babel',
  presets: [
    [ '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '2.0.0'
      },
    ],
  ],
};
