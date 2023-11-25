#!/usr/bin/env bash

set -ex
source .ci/config.sh
source .ci/config-app.sh

: "${WORKSPACE_PATH:?WORKSPACE_PATH must be set}"
: "${REMOTE_APP_DIRECTORY:?REMOTE_APP_DIRECTORY must be set}"

(cd ${WORKSPACE_PATH} && .ci/inject-docker-variables.sh)
if [ ! -f "${WORKSPACE_PATH}/.env.prod" ]; then
  touch ${WORKSPACE_PATH}/.env.prod
fi
scp -O ${SCP_PORT} ${WORKSPACE_PATH}/.env.prod ${SSH_USER}@${SSH_HOST}:${BASE_DIRECTORY}${REMOTE_APP_DIRECTORY}/.env
rm ${WORKSPACE_PATH}/.env.prod

scp -O ${SCP_PORT} ${WORKSPACE_PATH}/.ci/docker-compose.yml ${SSH_USER}@${SSH_HOST}:${BASE_DIRECTORY}${REMOTE_APP_DIRECTORY}/docker-compose.yml

docker save -o $(pwd)/${APP}.tar "${APP_TAG}"

scp -O ${SCP_PORT} $(pwd)/${APP}.tar ${SSH_USER}@${SSH_HOST}:${BASE_DIRECTORY}${APP}.tar
rm -f $(pwd)/${APP}.tar

ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "docker rm -f ${APP} || true"
ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "docker load -i ${BASE_DIRECTORY}${APP}.tar"
ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "rm -f ${BASE_DIRECTORY}${APP}.tar"
ssh ${SSH_PORT_OPT} ${SSH_USER}@${SSH_HOST} "cd ${BASE_DIRECTORY}${REMOTE_APP_DIRECTORY} && docker-compose up --detach --build ${APP}"
