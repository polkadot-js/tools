# `Dockerfile` is generated from `Dockerfile.tmpl` via `docker.sh`
#
# To make build changes and have it reflect via the `Dockerfile`, you
# would make any build changes to `Dockerfile.tmpl`. `docker.sh build`
# takes this, adds the version from `package.json` and pulls a package
# from npm to do the the actual versioned build

# base image
FROM ubuntu:18.04

# Run package updates
RUN apt-get update
RUN apt-get install -y curl gcc g++ make python git

# install node
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# env variable works around gyp install (secp256k1) with root permissions
RUN NPM_CONFIG_USER=root npm install -g @polkadot/api-cli@0.30.2-3 @polkadot/json-serve@0.30.2-3 @polkadot/metadata-cmp@0.30.2-3 @polkadot/monitor-rpc@0.30.2-3 @polkadot/signer-cli@0.30.2-3 @polkadot/vanitygen@0.30.2-3

# copy the cli wrapper to this container
COPY cli.sh .

# run the cli wrapper with options as passed
ENTRYPOINT ["./cli.sh"]
