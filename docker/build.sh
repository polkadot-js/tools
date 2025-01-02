#!/bin/bash
# Copyright 2018-2025 @polkadot/tools authors & contributors
# SPDX-License-Identifier: Apache-2.0

# fail fast on any non-zero exits
set -e

# the option as passed on the commandline
CMD="$1"

# the docker image name and dockerhub repo
NAME="polkadot-js-tools"
REPO="jacogr"

if ! jq --help 2>&1 1>/dev/null
then
  echo ""
  echo "FATAL: 'jq' was not found in your PATH. Please install it."
  echo ""
  echo "       This script uses the 'jq' binary to extract the latest"
  echo "       published npm version and then installs that version to"
  echo "       build the docker image"
  echo ""
  exit 1
fi

if ! docker --help 2>&1 1>/dev/null
then
  echo ""
  echo "FATAL: 'docker' was not found in your PATH. Please install it."
  echo ""
  echo "       This script builds images using the 'docker' binary and as"
  echo "       such it requires the binary for any image build and publish"
  echo "       operations"
  echo ""
  exit 1
fi

# extract the current npm version from package.json
VERSION=$(cat package.json | jq .versions.npm --raw-output)

# helper function for the build logic
function build () {
  echo "*** Creating Dockerfile from npm version $VERSION"
  sed "s/VERSION/$VERSION/g" docker/Dockerfile.tmpl > docker/Dockerfile

  echo "*** Building $NAME:$VERSION"
  docker build -t $NAME docker

  echo "*** Testing $NAME:$VERSION"
  docker run $NAME api --help

  exit 0
}

# helper function for the publishing logic
function publish () {
  if [ -n "$DOCKER_PASS" ]; then
    docker login -u $REPO -p $DOCKER_PASS
  fi

  echo "*** Tagging $REPO/$NAME"
  docker tag $NAME $REPO/$NAME
  docker tag $NAME $REPO/$NAME:$VERSION

  echo "*** Publishing $NAME"
  docker push $REPO/$NAME
  docker push $REPO/$NAME:$VERSION

  exit 0
}

# helper function for the usage logic
function usage () {
  echo ""
  echo "This builds a docker image for the latest npm published version."
  echo "For maintainers publishing functionality is also provided."
  echo ""
  echo "Usage: build.sh <build|publish>"
  echo "Commands:"
  echo "  build: builds a $NAME docker image"
  echo "  publish: publishes a built image to dockerhub"
  echo ""

  exit 1
}

# execute the command specified
case $CMD in
  build)
    build
    ;;
  publish)
    publish
    ;;
  *)
    usage
    ;;
esac
