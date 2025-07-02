# @polkadot/tools

This is a collection of cli tools to use on Polkadot and Substrate chains.

## Overview

The repo is split up into a number of internal packages -

- [@polkadot/api-cli](packages/api-cli/) A cli tool to allow you to make API calls to any running node
- [@polkadot/json-serve](packages/json-serve/) A server that serves JSON outputs for specific queries
- [@polkadot/monitor-rpc](packages/monitor-rpc/) A simple monitoring interface that checks the health of a remote node via RPC
- [@polkadot/signer-cli](packages/signer-cli/) A cli tool that allows you to generate transactions in one terminal and sign them in another terminal (or computer)
- [@polkadot/vanitygen](packages/vanitygen/) Generate vanity addresses, matching some pattern

## Installation

You can install the packages globally via npm, i.e.

```
# api-cli or monitor-rpc or ...
npm install -g @polkadot/api-cli
```

And then you can execute it via `polkadot-js-api [...options]` or `polkadot-js-monitor [...options]`

## Docker

Alternatively a docker image is provided as well (or you can build your own from this repo). Usage is as follow -

```
docker run jacogr/polkadot-js-tools <api|json|metadata|monitor|signer|vanity> [...options | --help]
```

With docker, if you are connecting to a local node for the API or monitor (or signer where the transaction is generated, i.e. the sign process is offline), and use the (default) `127.0.0.1` host, you would need to pass `--network=host` as a flag, i.e. `docker run --network=host ...` and pass the appropriate flags to the node to allow connections for docker.

## Development

Contributions are welcome!
