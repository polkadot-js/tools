# @polkadot/signer-cli

A simple CLI interface for offline signing. This can also be executed via the [docker image](../../README.md#docker).

## Create a transaction

To create a transaction, you need to use the API to connect to a chain, enabling the creation of a transaction using the chain's metadata. In a terminal, run the `submit` command with the following form:

`yarn run:signer submit --account <ss58> --ws <endpoint> <module.method> [param1] [...] [paramX]`

For instance, to make a transfer, we run the following command:

`yarn run:signer submit --account 5HNHXTw65dTNVGRdYkxFUpKcvmUYQMZHcDHmSKpuC8pvVEaN --ws wss://poc3-rpc.polkadot.io/ balances.transfer 5DkQbYAExs3M2sZgT1Ec3mKfZnAQCL4Dt9beTCknkCUn5jzo 123`

On execution, it will prompt us with:

```
Payload: 0x040300ff4a83f1...a8239139ff3ff7c3f6
Signature>
```

The `Payload` is the hex that needs to be signed. Pasting the hex signature (followed by `Enter`) submits it to the chain.

## Sign a transaction

To sign, you do not need a network connection at all and this command does not use the API to make connections to a chain. In a terminal, run the `sign` command with the following form:

`yarn run:signer sign --account <ss58> --seed <suri> --type <ed25519|sr25519> <hex payload>`

For instance, to sign the transfer made above, we run:

`yarn run:signer sign --account 5HNHXTw65dTNVGRdYkxFUpKcvmUYQMZHcDHmSKpuC8pvVEaN --seed "leaf ... rude" --type sr25519 0x040300ff4a83f1...a8239139ff3ff7c3f6`

On execution, it will respond with:

```
Signature: 0xe6facf194a8e...413ce3155c2d1240b
```

Paste this signature into the submission in the first terminal, and off we go.

By default, `submit` will create a mortal extrinsic with a lifetime of 50 blocks. Assuming a six-second block time, you will have five minutes to go offline, sign the transaction, paste the signature, and submit the signed transaction.

## Send offline

This functionality lets you generate signed transaction for execution at a later date. It is intended to resemble MyEtherWallet's [`Send offline`](https://kb.myetherwallet.com/en/offline/offline_transaction/) feature.

The flow is similar to the `submit` command. First, run the `sendOffline` command on a computer with a network connection:

`yarn run:signer sendOffline --account 5HNHXTw65dTNVGRdYkxFUpKcvmUYQMZHcDHmSKpuC8pvVEaN --ws wss://poc3-rpc.polkadot.io/ balances.transfer 5DkQbYAExs3M2sZgT1Ec3mKfZnAQCL4Dt9beTCknkCUn5jzo 123`

This will give you a payload to sign. Use the `sign` command as per instructions above.

Once you've pasted the signature into the `sendOffline` terminal (and hit `Enter`), it will print the signed transaction that can be stored and submitted later.

Run `yarn run:signer --help` to learn about optional parameters.
