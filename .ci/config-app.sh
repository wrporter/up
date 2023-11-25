#!/usr/bin/env bash

source .ci/config.sh

SSH_PORT_OPT="-p ${SSH_PORT}"
SCP_PORT="-P ${SSH_PORT}"
BASE_DIRECTORY="/volume1/docker/"

if [ -z "${APP}" ]; then
  echo "Variable APP must be defined to build app"
  exit 1
fi

APP_IMAGE=""${NAMESPACE}/${BASE_APP}-${APP}""
APP_TAG="${APP_IMAGE}:${VERSION}"
