# @polkadot/monitor-rpc

A simple RPC monitor that provides output to both the console and via an HTTP interface.

## Usage

```
yarn run:monitor --ws ws://localhost:9944 --port 8181
```

Then just doing a get on `localhost:8181` should return something like

```
{"blockNumber":7030,"blockTimestamp":"2018-11-27T09:51:06.283Z","elapsed":1.828,"ok":true}
```

If you are installing it globally -

```
$ yarn add global @polkadot/monitor-rpc
$ polkadot-js-monitor ...
```
