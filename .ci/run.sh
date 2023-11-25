#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Running Docker container with arguments [${@}]"

docker run \
	--rm \
	--name=${APP_NAME} \
	-e TURBO_TEAM="${TURBO_TEAM}" \
	-e TURBO_TOKEN="${TURBO_TOKEN}" \
	-e TURBO_REMOTE_CACHE_SIGNATURE_KEY="${TURBO_REMOTE_CACHE_SIGNATURE_KEY}" \
	${TARGET_IMAGE}:${VERSION} \
	${@}

echo "-- ${0} complete!"
