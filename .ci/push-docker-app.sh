#!/usr/bin/env bash

set -e
source .ci/config.sh
source .ci/config-app.sh

echo "-- ${0} start..."
echo "-- Pushing docker image: ${APP_IMAGE}"
echo "-- Tags [latest, ${VERSION}]"

docker tag ${TAG} ${APP_IMAGE}:latest
docker push ${APP_IMAGE} --all-tags

echo "-- ${0} complete!"
