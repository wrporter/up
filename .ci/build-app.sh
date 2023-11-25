#!/usr/bin/env bash

set -e
source .ci/config.sh
source .ci/config-app.sh

echo "-- ${0} start..."
echo "-- Building docker image for production: ${APP}"

docker rmi ${APP_TAG} >/dev/null 2>&1 || true

buildDocker \
  --cache-from="${APP_TAG}" \
  --build-arg ARTIFACT_IMAGE="${BASE_IMAGE}:${VERSION}" \
  --build-arg APP=${APP} \
  --build-arg APP_ID=${APP_ID} \
  --build-arg BUILD_SHA=${VERSION} \
  --build-arg BUILD_BRANCH=${GIT_BRANCH} \
  --build-arg BUILD_DATE=${BUILD_DATE} \
  --tag "${APP_TAG}" \
  --tag "${APP_IMAGE}:latest" \
  --file .ci/main.Dockerfile \
  .
#  - < .ci/main.Dockerfile # TODO Account for multiple types of apps with ${APP_TYPE}.Dockerfile

echo "-- ${0} complete!"
