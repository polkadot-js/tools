# @polkadot/metadata-cmp

A utility to compare metadata from 2 sources

## Usage

Commands are of the form,

```
yarn run:metadata <ws1> <ws2> [options]
```

Where `ws1` is the first websocket, and `ws2` is the second websocket. The `options` are as follows:

`--legacy`: Use of the legacy rpc method `api.rpc.state.getMetadata` for retrieving metadata. When this is false or empty the default `api.call.metadata.metadataAtVersion` will be used.
