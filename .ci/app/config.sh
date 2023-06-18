#!/usr/bin/env bash

NAMESPACE="wesp"
APP_NAME="${APP_NAME:-up}"
SLACK_CHANNEL="#todo"

SSH_PORT_OPT="-p ${SSH_PORT}"
SCP_PORT="-P ${SSH_PORT}"
BASE_DIRECTORY="/volume1/docker/"
DOCKER_REGISTRY="192.168.1.222:5555"

DOCKER_REGISTRY_URL="${DOCKER_REGISTRY_URL:-${DOCKER_REGISTRY}}"
IMAGE_PATH="${IMAGE_PATH:-${NAMESPACE}/${APP_NAME}}"
TARGET_IMAGE="${IMAGE_PATH}"

VERSION="${GIT_COMMIT:-$(git rev-parse HEAD)}"

APP_ID=${APP_NAME}
BUILD_ID=${BUILD_ID:="FAKE_ID_123"}
BUILD_DATE=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

GIT_REPO_URL="${GIT_URL:-$(git remote get-url origin)}"
GIT_COMMIT=${GIT_COMMIT:-$(git rev-parse HEAD)}
GIT_AUTHOR_EMAIL=${GIT_AUTHOR_EMAIL:-$(git show -s --format="%ae" HEAD)}
GIT_BRANCH=${GIT_BRANCH:-"$(git rev-parse --abbrev-ref HEAD)"}
GIT_BRANCH_NAME=$(echo ${GIT_BRANCH} | rev | cut -d/ -f1 | rev)
