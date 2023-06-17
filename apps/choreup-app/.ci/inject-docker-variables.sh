#!/usr/bin/env bash

set -e

echo "-- ${0} start..."

sed -i.tmp "s/\${GOOGLE_OAUTH_CLIENT_ID}/${CHECKIT_GOOGLE_OAUTH_CLIENT_ID}/g" .ci/docker-compose.yml.tmp
sed -i.tmp "s/\${GOOGLE_OAUTH_CLIENT_SECRET}/${CHECKIT_GOOGLE_OAUTH_CLIENT_SECRET}/g" .ci/docker-compose.yml.tmp
sed -i.tmp "s/\${SESSION_SECRET}/${CHECKIT_SESSION_SECRET}/g" .ci/docker-compose.yml.tmp

echo "-- ${0} complete!"
