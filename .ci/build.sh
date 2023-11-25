#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Building docker image for production"

buildDocker \
	--progress=plain \
	--file .ci/Dockerfile \
	--tag "${IMAGE_PATH}:${VERSION}" \
	.

echo "-- ${0} complete!"
