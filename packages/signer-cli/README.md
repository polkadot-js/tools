# @polkadot/signer-cli

A simple cli interface for offline siging

## Create transactions to sign

In a terminal, run the `submit` command with the following form -

`yarn run:signer submit --account <ss58> --ws <endpoint> <module.method> [param1] [...] [paramX]`

For instance to make a transfer, we run the following command -

`yarn run:signer submit --account 5HNHXTw65dTNVGRdYkxFUpKcvmUYQMZHcDHmSKpuC8pvVEaN --ws wss://poc3-rpc.polkadot.io/ balances.transfer 5DkQbYAExs3M2sZgT1Ec3mKfZnAQCL4Dt9beTCknkCUn5jzo 123 `

On execution it will prompt us with -

```
Payload: 0x040300ff4a83f1...a8239139ff3ff7c3f6
Signature>
```

The `Payload` is the hex that needs to be signed. Pasting the hex signature (followed by `Enter`) submits it to the chain.

## Sign transactions

In a terminal, run the `sign` command with the following form -

`yarn run:signer sign --account <ss58> --seed <suri> --type <ed25519|sr25519> <hex payload>`

For instance to sign the transfer made above, we run -

`yarn run:signer sign --account 5HNHXTw65dTNVGRdYkxFUpKcvmUYQMZHcDHmSKpuC8pvVEaN --seed "leaf .. rude" --type sr25519 0x040300ff4a83f1...a8239139ff3ff7c3f6`

On executing, it will respond with -

```
Signature: 0xe6facf194a8e...413ce3155c2d1240b
```

Paste this signature into the submission in the first terminal, and off we go.
