#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Publishing packages"

docker run \
	--rm \
	--name=${APP_NAME} \
	${TARGET_IMAGE}:${VERSION} \
	bash -c "npm run release"

echo "-- ${0} complete!"
