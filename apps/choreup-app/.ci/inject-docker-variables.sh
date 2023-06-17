#!/usr/bin/env bash

set -e

echo "-- ${0} start..."

if [[ -z "${CHOREUP_ENV}" ]]; then
  echo "${CHOREUP_ENV}" >> prod.env
fi

echo "-- ${0} complete!"
