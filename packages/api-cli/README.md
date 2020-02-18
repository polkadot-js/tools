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
yarn run:api query.system.account 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

To do the same, running as a subscription and streaming results

```
yarn run:api query.system.account 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY --sub
```

To make a transfer from Alice to Bob, the following can be used -

```
yarn run:api tx.balances.transfer 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty 12345 --seed "//Alice"
```

### Sudo

Some transactions require superuser access. For example, to change the runtime code, you can do

```
yarn run:api --sudo --seed "//Alice" tx.system.setCode $(xxd -p test.wasm | tr -d $'\n' | xargs printf '0x%s')
```

Unpacking that command line:

- `--sudo`: don't use normal authentication, but instead get the superuser authentication from the test keyring and upgrade the following transaction
- `--seed "//Alice"`: attempt to use the Alice key as the superuser.
- `xxd -p test.wasm`: convert the file `test.wasm` into hexadecimal
- `tr -d $'\n'`: remove newlines from the hexadecimal blob
- `xargs printf '0x%s'`: insert a leading '0x' onto the front of the blob

In all cases when sudoing, the seed provided should be that of the superuser. For most development nets, that is `"//Alice"`.

## Global Installation

```
$ yarn global add @polkadot/api-cli
$ polkadot-js-api ...
```

## Other options

The `--ws` param can be used to connect to other Webscoket endpoints, when submitting transactions, you can use the `--seed <seed>` to specify an account seed. To read documentation on a call, use the `--info` command.

For a complete list of available commands, you can use `--help`
