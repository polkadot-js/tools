# @polkadot/api-cli

A simple cli interface to the [@polkadot/api](https://github.com/polkadot-js/api).

## Usage

Commands are of the form,

```
yarn run:api [options] <type> <...params>
```

Where type is the type of query to be made, this takes the form of `<type>.<section>.<method>` where `type` is one of `derive`, `query`, `rpc` `tx` (mapping to the API) and the `section` and `method` are available calls.

For instance to make a query to retrieve Alice's balances, you can do

```
yarn run:api query.balances.freeBalance 5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ
```

To do the same, running as a subscription and streaming results

```
yarn run:api query.balances.freeBalance 5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ --sub
```

## Other options

The `--ws` param can be used to connect to other Webscoket endpoints, when submitting transactions, you can use the `--seed <seed>` to specify an account seed. To read documentation on a call, use the `--info` command.

For a complete list of available commands, you can use `--help`
