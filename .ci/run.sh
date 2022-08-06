#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Running Docker container with arguments [${@}]"

docker run -it --init  \
	--rm \
	--name=${APP_NAME} \
	${TARGET_IMAGE}:${VERSION} \
	${@}

echo "-- ${0} complete!"
