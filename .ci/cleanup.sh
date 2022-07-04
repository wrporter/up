#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- cleanup.sh start..."
echo "-- Cleaning up leftover docker images"

docker rmi "${TARGET_IMAGE}:${VERSION}" >/dev/null 2>&1 || true

echo "-- cleanup.sh complete!"
