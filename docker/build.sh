#!/bin/bash
# Copyright 2018-2020 @polkadot/tools authors & contributors
# SPDX-License-Identifier: Apache-2.0

# fail fast on any non-zero exits
set -e

# the option as passed on the commandline
CMD="$1"

# the docker image name and dockerhub repo
NAME="polkadot-js-tools"
REPO="jacogr"

# extract the current npm version from package.json
VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | sed 's/ //g')

# helper function for the build logic
function build () {
  echo "*** Creating Dockerfile from latest npm version"
  sed "s/VERSION/$VERSION/g" docker/Dockerfile.tmpl > docker/Dockerfile

  echo "*** Building $NAME"
  docker build -t $NAME docker

  exit 0
}

# helper function for the publishing logic
function publish () {
  if [ -n "$DOCKER_PASS" ]; then
    docker login -u $REPO -p $DOCKER_PASS
  fi

  echo "*** Tagging $REPO/$NAME"
  docker tag $NAME $REPO/$NAME

  echo "*** Publishing $NAME"
  docker push $REPO/$NAME

  exit 0
}

# helper function for the usage logic
function usage () {
  echo "This builds a docker image for the latest npm published version."
  echo "For maintainers publishing functionality is also provided."
  echo ""
  echo "Usage: docker.sh <build|publish>"
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
