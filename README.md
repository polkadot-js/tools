[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
[![npm](https://img.shields.io/npm/v/@polkadot/api-cli?logo=npm&style=flat-square)](https://www.npmjs.com/package/@polkadot/api-cli)
[![beta](https://img.shields.io/npm/v/@polkadot/api-cli/beta?label=beta&logo=npm&style=flat-square)](https://www.npmjs.com/package/@polkadot/api-cli)
[![maintainability](https://img.shields.io/codeclimate/maintainability-percentage/polkadot-js/tools?logo=code-climate&style=flat-square)](https://codeclimate.com/github/polkadot-js/tools/maintainability)

# @polkadot/tools

This is a collection of cli tools to use on Polkadot and Substrate chains.

## Overview

The repo is split up into a number of internal packages -

- [@polkadot/api-cli](packages/api-cli/) A cli tool to allow you to make API calls to any running node
- [@polkadot/monitor-rpc](packages/monitor-rpc/) A simple monitoring interface that checks the health of a remote node via RPC
- [@polkadot/signer-cli](packages/signer-cli/) A cli tool that allows you to generate transactions in one terminal and sign them in another terminal (or computer)

## Installation

You can install the packages globally via npm, i.e.

```
# api-cli or monitor-rpc
npm install -g @polkadot/api-cli
```

And then you can execute it via `polkadot-js-api [...options]` or `polkadot-js-monitor [...options]`

## Docker

Alternatively a docker image is provided as well (or you can build your own from this repo). Usage is as follow -

```
docker run jacogr/polkadot-js-tools <api|monitor|signer> [...options | --help]
```

With docker, if you are connecting to a local node for the API or monitor (or signer where the transaction is generated, i.e. the sign process is offline), and use the (default) `127.0.0.1` host, you would need to pass `--network=host` as a flag, i.e. `docker run --network=host ...` and pass the appropriate flags to the node to allow connections for docker.

## Development

Contributions are welcome!
