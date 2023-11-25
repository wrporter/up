#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Cleaning up leftover docker images"

docker rmi "${IMAGE_PATH}:${VERSION}" >/dev/null 2>&1 || true

echo "-- ${0} complete!"
