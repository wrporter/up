#!/usr/bin/env bash

source .ci/config.sh

# Add the following option when using custom environment variables in development
# --env-file .env \

docker run -it --init \
	--rm \
	--name=${APP_NAME} \
	-p 3000:3000 \
	-p 22500:22500 \
	${TARGET_IMAGE}:${VERSION}
