#!/usr/bin/env bash

NAMESPACE="wesp"
BASE_APP="up"
SLACK_CHANNEL="#todo"

BASE_IMAGE="${NAMESPACE}/${BASE_APP}-base"

VERSION="${GIT_COMMIT:-$(git rev-parse HEAD)}"

BASE_APP_ID=${BASE_APP}
BUILD_ID=${BUILD_ID:="LOCAL_BUILD_ID"}
BUILD_DATE=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
CONTAINER_NAME="${BASE_APP}-${BUILD_ID}"

GIT_REPO_URL="${GIT_URL:-$(git remote get-url origin)}"
GIT_COMMIT=${GIT_COMMIT:-$(git rev-parse HEAD)}
GIT_AUTHOR_EMAIL=${GIT_AUTHOR_EMAIL:-$(git show -s --format="%ae" HEAD)}
GIT_BRANCH=${GIT_BRANCH:-"$(git rev-parse --abbrev-ref HEAD)"}
GIT_BRANCH_NAME=$(echo ${GIT_BRANCH} | rev | cut -d/ -f1 | rev)

function buildDocker() {
  docker build \
    --label "app.build-info.build-time=${BUILD_DATE}" \
    --label "app.build-info.git-branch=${GIT_BRANCH_NAME}" \
    --label "app.build-info.git-commit=${GIT_COMMIT}" \
    --label "app.build-info.git-repo=${GIT_REPO_URL}" \
    --label "app.build-info.git-user-email=${GIT_AUTHOR_EMAIL}" \
    --label "app.build-info.slack-channel=${SLACK_CHANNEL}" \
	  --build-arg TURBO_REMOTE_CACHE_SIGNATURE_KEY="${TURBO_REMOTE_CACHE_SIGNATURE_KEY}" \
    $@
}
