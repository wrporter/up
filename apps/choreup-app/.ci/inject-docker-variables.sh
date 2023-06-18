#!/usr/bin/env bash

set -e

echo "-- ${0} start..."

if [ -n "${CHOREUP_ENV}" ]; then
  echo "${CHOREUP_ENV}" > .env.prod
fi

echo "-- ${0} complete!"
