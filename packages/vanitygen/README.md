# @polkadot/vanitygen

A cli vanity generator

## Usage

```
yarn run:vanity --match cook13 --mnemonic --network kusama --type ed25519
```

When using the `--mnemonic` option, the generation will be very slow since it needs to generate mnemonics and then test the resulting outputs.

As with all other cli utilities `--help` will return a list of the available options.

If you are installing it globally -

```
$ yarn global add @polkadot/vanitygen
$ polkadot-js-vanitygen ...
```
