# @polkadot/monitor

Simple monitoring tools.

## Monitor

```
yarn run:monitor --ws ws://localhost:9944 --port 8181
```

Then just doing a get on `localhost:8181` should return something like

```
{"blockNumber":7030,"blockTimestamp":"2018-11-27T09:51:06.283Z","elapsed":1.828,"ok":true}
```

## API cli

```
yarn run:api [options] <type> <...params>
```

For instance to make a query to retrieve Alice's balances,

```
yarn run:api query.balances.freeBalance 5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ
```

To do the same, running as a subscription

```
yarn run:api query.balances.freeBalance 5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ --sub
```

In the same vein, the `--ws` param can be used to connect to other Webscoket endpoints

When submitting transactions, you can use the `--seed <seed>` to specify an account seed. To read documentation on a call, use the `--info` command.
