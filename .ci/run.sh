#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Running Docker container with arguments [${@}]"

docker run \
  -t \
	--rm \
	--name=${APP_NAME} \
	-e TURBO_TEAM="${TURBO_TEAM}" \
	-e TURBO_TOKEN="${TURBO_TOKEN}" \
	-e TURBO_REMOTE_ONLY=true \
	${IMAGE_PATH}:${VERSION} \
	${@}

echo "-- ${0} complete!"
