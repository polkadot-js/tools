#!/usr/bin/env node
// Copyright 2018-2020 @polkadot/signer-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable header/header */

const fs = require('fs');
const path = require('path');

const [compiled] = ['./signer.js']
  .map((file) => path.join(__dirname, file))
  .filter((file) => fs.existsSync(file));

if (compiled) {
  require(compiled);
} else {
  require('@babel/register')({
    extensions: ['.js', '.ts'],
    plugins: [
      ['module-resolver', {
        alias: {
          '^@polkadot/api-cli(.*)': './packages/api-cli/src\\1'
        }
      }]
    ]
  });
  require('./signer');
}
