# @polkadot/sudo-cli

A simple cli interface to execute [@polkadot/api](https://github.com/polkadot-js/api) transactions as the superuser.

## Usage

Commands are of the form,

```
yarn run:sudo [options] <type> <...params>
```

Where type is the type of query to be made, this takes the form of `<section>.<method>` where `section` and `method` are available `tx` calls.

For instance, to make a query to change the runtime code, you can do

```
yarn run:sudo system.setCode $(xxd -p test.wasm | tr -d $'\n' | xargs printf '0x%s')
```

Note that we don't just pass in the filename `test.wasm`; pass it through the `xxd` to `tr -d` to `printf` pipeline. Calls which expect binary data expect it expressed as hexadecimal with a `0x` prefix, and we don't want to have to handle call-specific knowledge for every sudoable function, so we have to process it externally. `xxd -p FILE` converts a file to hex, but inserts some newlines; `tr -d $'\n'` removes the newlines, and `printf` inserts the leading `0x`.


## Other options

The `--ws` param can be used to connect to other Webscoket endpoints.

For a complete list of available commands, you can use `--help`
