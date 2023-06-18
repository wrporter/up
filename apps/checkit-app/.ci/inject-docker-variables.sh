#!/usr/bin/env bash

set -e

echo "-- ${0} start..."

if [ -n "${CHECKIT_ENV}" ]; then
  echo "${CHECKIT_ENV}" > .env.prod
fi

echo "-- ${0} complete!"
