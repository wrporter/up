#!/usr/bin/env bash

source .ci/config.sh

APP=api-tests
DATA_CENTER=${DATA_CENTER:-docker}

docker run -it --init \
  --rm \
  --name=${APP_NAME}-${APP} \
  -e DATA_CENTER=${DATA_CENTER} \
  ${TARGET_IMAGE}-${APP}:${VERSION}
