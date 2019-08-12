# @polkadot/api-cli

A simple cli interface to the [@polkadot/api](https://github.com/polkadot-js/api).

## Usage

Commands are of the form,

```
yarn run:api [options] <type> <...params>
```

Where type is the type of query to be made, this takes the form of `<type>.<section>.<method>` where `type` is one of `consts`, `derive`, `query`, `rpc` `tx` (mapping to the API) and the `section` and `method` are available calls.

For instance to make a query to retrieve Alice's balances, you can do

```
yarn run:api query.balances.freeBalance 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

To do the same, running as a subscription and streaming results

```
yarn run:api query.balances.freeBalance 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY --sub
```

To make a transfer from Alice to Bob, the following can be used -

```
yarn run:api tx.balances.transfer 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty 12345 --seed "//Alice"
```

If you are installing it globally -

```
$ yarn add global @polkadot/api-cli
$ polkadot-js-api ...
```

## Other options

The `--ws` param can be used to connect to other Webscoket endpoints, when submitting transactions, you can use the `--seed <seed>` to specify an account seed. To read documentation on a call, use the `--info` command.

For a complete list of available commands, you can use `--help`
