#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Building docker image for production"

docker rmi "${BASE_IMAGE}:${VERSION}" >/dev/null 2>&1 || true

buildDocker \
  --file .ci/base.Dockerfile \
  --build-arg VERSION=${VERSION} \
  --tag "${BASE_IMAGE}:${VERSION}" \
  .

buildDocker \
  --build-arg ARTIFACT_IMAGE="${BASE_IMAGE}:${VERSION}" \
  --build-arg VERSION=${VERSION} \
  --tag "${BASE_IMAGE}-runner:${VERSION}" \
  - < .ci/runner.Dockerfile

echo "-- ${0} complete!"
