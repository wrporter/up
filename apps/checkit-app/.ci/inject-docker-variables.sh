#!/usr/bin/env bash

set -e

echo "-- ${0} start..."

if [[ -z "${CHECKIT_ENV}" ]]; then
  echo "${CHECKIT_ENV}" > prod.env
fi

echo "-- ${0} complete!"
