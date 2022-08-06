#!/usr/bin/env bash

set -e
source .ci/app/config.sh

echo "-- ${0} start..."
echo "-- Running Docker container with arguments [${@}]"

docker run -it --init \
	--rm \
	--name=${APP_NAME} \
	-p 3000:3000 \
	${TARGET_IMAGE}:${VERSION} \
	${@}

echo "-- ${0} complete!"
