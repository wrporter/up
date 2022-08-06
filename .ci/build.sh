#!/usr/bin/env bash

set -e
source .ci/config.sh

echo "-- ${0} start..."
echo "-- Building docker image for production"

DOCKER_BUILDKIT=1 docker build \
  --progress=plain \
	--build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from="${TARGET_IMAGE}:${VERSION}" \
	--file .ci/Dockerfile \
  --label "app.build-info.service-name=${APP_NAME}" \
	--label "app.build-info.build-time=${BUILD_DATE}" \
	--label "app.build-info.git-branch=${GIT_BRANCH_NAME}" \
	--label "app.build-info.git-commit=${GIT_COMMIT}" \
	--label "app.build-info.git-repo=${GIT_REPO_URL}" \
	--label "app.build-info.git-user-email=${GIT_AUTHOR_EMAIL}" \
	--label "app.build-info.slack-channel=${SLACK_CHANNEL}" \
	--tag "${TARGET_IMAGE}:${VERSION}" \
	.

echo "-- ${0} complete!"
