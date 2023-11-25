#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Publishing packages"

REGISTRY_URL="registry.npmjs.org/"

docker run \
  -t \
	--rm \
	--name=${APP_NAME} \
	-e TURBO_TEAM="${TURBO_TEAM}" \
	-e TURBO_TOKEN="${TURBO_TOKEN}" \
	-e TURBO_REMOTE_CACHE_SIGNATURE_KEY="${TURBO_REMOTE_CACHE_SIGNATURE_KEY}" \
	${IMAGE_PATH}:${VERSION} \
	bash -c "echo '//${REGISTRY_URL}:_authToken="${REGISTRY_AUTH_TOKEN}"' >> .npmrc \
  && echo '//${REGISTRY_URL}:email=${REGISTRY_EMAIL}' >> .npmrc \
  && echo '//${REGISTRY_URL}:always-auth=true' >> .npmrc \
  && npm run release"

echo "-- ${0} complete!"
