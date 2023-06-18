#!/usr/bin/env bash

set -e

echo "-- ${0} start..."

if [ -n "${COMMIT_ENV}" ]; then
  echo "${COMMIT_ENV}" > .env.prod
fi

echo "-- ${0} complete!"
