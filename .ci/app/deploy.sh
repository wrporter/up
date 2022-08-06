#!/usr/bin/env bash

# First run .ci/app/build.sh to build the image before release.

set -e
source .ci/app/config.sh

: "${WORKSPACE_PATH:?WORKSPACE_PATH must be set}"
: "${REMOTE_APP_DIRECTORY:?REMOTE_APP_DIRECTORY must be set}"

cp ${WORKSPACE_PATH}/.ci/docker-compose.yml .ci/docker-compose.tmp.yml
${WORKSPACE_PATH}/.ci/inject-docker-variables.sh

scp ${SCP_PORT} $(pwd)/.ci/docker-compose.tmp.yml ${SSH_USER}@${SSH_HOST}:${BASE_DIRECTORY}${REMOTE_APP_DIRECTORY}/docker-compose.yml

rm .ci/docker-compose.tmp.yml

docker save -o $(pwd)/${APP_NAME}.tar "${TARGET_IMAGE}:latest"

scp ${SCP_PORT} $(pwd)/${APP_NAME}.tar ${SSH_USER}@${SSH_HOST}:${BASE_DIRECTORY}${APP_NAME}.tar
rm -f $(pwd)/${APP_NAME}.tar

ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "docker rm -f ${APP_NAME} || true"
ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "docker load -i ${BASE_DIRECTORY}${APP_NAME}.tar"
ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "rm -f ${BASE_DIRECTORY}${APP_NAME}.tar"
ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "cd ${BASE_DIRECTORY}${REMOTE_APP_DIRECTORY} && docker-compose up --detach --build ${APP_NAME}"
