#!/usr/bin/env node
// @ts-check
// Copyright 2018-2020 @polkadot/api-cli authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const [compiled] = ['./vanitygen.js']
  .map((file) => path.join(__dirname, file))
  .filter((file) => fs.existsSync(file));

if (compiled) {
  require(compiled);
} else {
  require('@babel/register')({
    extensions: ['.js', '.ts']
  });
  require('./vanitygen');
}
