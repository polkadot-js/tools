[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange.svg?style=flat-square)](https://polkadot.js.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)
[![style](https://img.shields.io/badge/code%20style-semistandard-lightgrey.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![travis](https://img.shields.io/travis/polkadot-js/tools.svg?style=flat-square)](https://travis-ci.com/polkadot-js/tools)
[![maintainability](https://img.shields.io/codeclimate/maintainability/polkadot-js/tools.svg?style=flat-square)](https://codeclimate.com/github/polkadot-js/tools/maintainability)
[![coverage](https://img.shields.io/coveralls/polkadot-js/tools.svg?style=flat-square)](https://coveralls.io/github/polkadot-js/tools?branch=master)
[![greenkeeper](https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg?style=flat-square)](https://greenkeeper.io/)

# @polkadot/tools

This is a collection of cli tools to use on Polkadot and Substrate chains.

## Overview

The repo is split up into a number of internal packages -

- [@polkadot/api-cli](packages/api-cli/) A cli tool to allow you to make API calls to any running node
- [@polkadot/monitor-rpc](packages/monitor-rpc/) A simple monitoring interface that checks the health of a remote node via RPC

## Installation

You can install the packages globally via npm, i.e.

```
# api-cli or monitor-rpc
npm install -g @polkadot/api-cli
```

And then you can execute it via `polkadot-js-api [...options]` or `polkadot-js-monitor [...options]

Alternatively a docker image is provided as well (or you can build your own from this repo). Usage is as follow -

```
docker run jacogr/polkadot-js-tools <api|monitor> [...options]
```

With docker, if you are connecting to a local node for the API or monitor, and use the (default) `127.0.0.1` host, you would need to pass `--network=host` as a flag, i.e. `docker run --network=host ...` and pass the appropriate flags to the node to allow connections for docker.

## Development

Contributions are welcome!
