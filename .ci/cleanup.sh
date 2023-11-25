#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Cleaning up leftover docker images"

docker rmi "${TARGET_IMAGE}:${VERSION}" >/dev/null 2>&1 || true

echo "-- ${0} complete!"
