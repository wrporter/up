#!/usr/bin/env bash

set -e

echo "-- ${0} start..."

sed -i "s/\${GOOGLE_OAUTH_CLIENT_ID}/${CHECKIT_GOOGLE_OAUTH_CLIENT_ID}/g" .ci/docker-compose.tmp.yml
sed -i "s/\${GOOGLE_OAUTH_CLIENT_SECRET}/${CHECKIT_GOOGLE_OAUTH_CLIENT_SECRET}/g" .ci/docker-compose.tmp.yml
sed -i "s/\${SESSION_SECRET}/${CHECKIT_SESSION_SECRET}/g" .ci/docker-compose.tmp.yml

echo "-- ${0} complete!"
