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

You can pass complex parameters as JSON which will be automatically parsed into the correct data structure

```
yarn run:api --sudo tx.validatorManager.registerValidators '["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]'
```


### Files as Parameters

It is often desirable to include large binary blobs as transaction parameters. These blobs are often already present in the local filesystem. Therefore, the CLI has special syntax to make life easier: any transaction parameter whose initial character is `@` is treated as a path to a binary file; its contents are automatically converted into appropriate hex form before sending the tx.

The `sudo` example demonstrates this.


### Sudo

Some transactions require superuser access. For example, to change the runtime code, you can do

```
yarn run:api --sudo --seed "//Alice" tx.system.setCode @test.wasm
```

In all cases when sudoing, the seed provided should be that of the superuser. For most development nets, that is `"//Alice"`.

### Encoded Call

Transactions can now be submitted using an encoded hex call. This is useful for complex extrinsics that are difficult to craft manually via the CLI. Instead, build the transaction using the [Polkadot-JS Apps UI](https://polkadot.js.org/apps/#/extrinsics), copy the encoded call, and execute it via CLI.

```
yarn run:api --encodedCall <encoded_call> --seed "<seed>" --ws <ws_endpoint>
```

```
yarn run:api --encodedCall 0x050300fe580ec5fe0e9569d645375acecf5aa19bc0b3188ddd2e2ffc68f6548590d61e0700e8764817 --seed "//Alice" --ws wss://paseo-rpc.dwellir.com
```

## Global Installation

```
$ yarn global add @polkadot/api-cli
$ polkadot-js-api ...
```


## Other options

The `--ws` param can be used to connect to other Websocket endpoints, when submitting transactions, you can use the `--seed <seed>` to specify an account seed. To read documentation on a call, use the `--info` command.

To specify types for a specific chain, you can use the `--types <types.json>` param, injecting the specified types into the API on construction.

To specify RPC types for a specific chain, you can use the `--rpc <rpc.json>` param, injecting the specified RPC types into the API on construction.

For a complete list of available commands, you can use `--help`
