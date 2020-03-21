#!/bin/bash
# Copyright 2019 @polkadot/tools authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

# fail fast on any non-zero exits
set -e

# the option as passed on the commandline
CMD="$1"
shift

# execute the command specified
case $CMD in
  api)
    polkadot-js-api "$@"
    exit 0
    ;;
  json)
    polkadot-js-json-serve "$@"
    exit 0
    ;;
  monitor)
    polkadot-js-monitor "$@"
    exit 0
    ;;
  signer)
    polkadot-js-signer "$@"
    exit 0
    ;;
  vanity)
    polkadot-js-vanitygen "$@"
    exit 0
    ;;
esac

echo "This executes polkadot-js cli commands."
echo ""
echo "Usage: <api|json|monitor|signer|vanity> [...options]"
echo ""
echo "Commands:"
echo "  api: Runs a cli interface to the api, use 'api --help' for options"
echo "  json: Exposes formatted queries via http, use `json --help` for options"
echo "  monitor: Runs a simple node monitor, use 'monitor --help' for options"
echo "  signer: Runs a simple offline signer, use 'signer --help' for options"
echo ""

exit 1
