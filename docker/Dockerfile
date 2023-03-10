# `Dockerfile` is generated from `Dockerfile.tmpl` via `docker.sh`
#
# To make build changes and have it reflect via the `Dockerfile`, you
# would make any build changes to `Dockerfile.tmpl`. `docker.sh build`
# takes this, adds the version from `package.json` and pulls a package
# from npm to do the the actual versioned build

# base image
FROM ubuntu:latest

# Run package updates
RUN apt-get update && \
  apt-get install -y build-essential curl gcc g++ gnupg make git
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

# env variable works around gyp install (secp256k1) with root permissions
RUN NPM_CONFIG_USER=root npm install -g @polkadot/api-cli@0.53.3 @polkadot/json-serve@0.53.3 @polkadot/metadata-cmp@0.53.3 @polkadot/monitor-rpc@0.53.3 @polkadot/signer-cli@0.53.3 @polkadot/vanitygen@0.53.3

# copy the cli wrapper to this container
COPY cli.sh .

# run the cli wrapper with options as passed
ENTRYPOINT ["./cli.sh"]
