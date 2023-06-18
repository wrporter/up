#!/usr/bin/env bash

set -e
source .ci/app/config.sh

echo "-- ${0} start..."
echo "-- Building docker image for production"

DOCKER_BUILDKIT=1 docker build \
  --progress=plain \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --build-arg SCOPE=${SCOPE} \
  --cache-from="${TARGET_IMAGE}:${VERSION}" \
  --file .ci/app/Dockerfile \
  --build-arg APP_ID=${APP_ID} \
  --build-arg BUILD_SHA=${VERSION} \
  --build-arg BUILD_BRANCH=${GIT_BRANCH} \
  --build-arg BUILD_DATE=${BUILD_DATE} \
  --label "app.build-info.service-name=${APP_NAME}" \
  --label "app.build-info.build-time=${BUILD_DATE}" \
  --label "app.build-info.git-branch=${GIT_BRANCH_NAME}" \
  --label "app.build-info.git-commit=${GIT_COMMIT}" \
  --label "app.build-info.git-repo=${GIT_REPO_URL}" \
  --label "app.build-info.git-user-email=${GIT_AUTHOR_EMAIL}" \
  --label "app.build-info.slack-channel=${SLACK_CHANNEL}" \
  --tag "${TARGET_IMAGE}:${VERSION}" \
  --tag "${TARGET_IMAGE}:latest" \
  .

echo "-- ${0} complete!"
