#!/usr/bin/env node
// Copyright 2018-2022 @polkadot/api-cli authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable header/header */

const fs = require('fs');
const path = require('path');

const [compiled] = ['../vanitygen.js']
  .map((file) => path.join(__dirname, file))
  .filter((file) => fs.existsSync(file));

if (compiled) {
  require(compiled);
} else {
  require('@babel/register')({
    extensions: ['.js', '.ts'],
    plugins: [
      ['babel-plugin-module-extension-resolver', {
        dstExtension: '',
        srcExtensions: ['.ts']
      }]
    ]
  });
  require('../../vanitygen');
}
