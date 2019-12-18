# @polkadot/json-serve

A simple tool that serves a limited subset of on-chain information as JSON output.

## Usage

```
yarn run:json-serve --ws ws://localhost:9944 --port 8181
```

Then just doing a get on `http://localhost:8181` should return something like

```
Error: Invalid query '?q=', expected '?q=<type>', one of 'bondedpercentage', 'totalbonded', 'totalcoins'
```

When passing a correctly formatted query, e.g. `http://localhost:8181?q=totalcoins` should return for the chain, e.g -

```
8168333.357737305935
```

If you are installing it globally -

```
$ yarn add global @polkadot/json-serve
$ polkadot-js-json-serve ...
```
