#!/usr/bin/env bash

set -e
source .ci/config.sh

.ci/build-base.sh
APP=commit-app .ci/build-app.sh
