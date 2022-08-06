###############################################################################
# Base
###############################################################################
FROM node:16-alpine AS base

RUN apk update && apk upgrade && apk add --no-cache curl bash git

# Needed for Vitest mocks to work properly. See https://github.com/vitest-dev/vitest/issues/1196
WORKDIR /usr/app

ARG SCOPE
ENV SCOPE=${SCOPE}
ENV YARN_CACHE_FOLDER=.yarn-cache

###############################################################################
# Prune
###############################################################################
FROM base AS pruner

RUN yarn global add turbo

COPY . .

RUN turbo prune --scope=${SCOPE} --docker

###############################################################################
# All Dependencies
###############################################################################
FROM base AS dependencies

COPY --from=pruner /usr/app/out/json/ .
COPY --from=pruner /usr/app/out/yarn.lock ./yarn.lock

RUN yarn install --frozen-lockfile

###############################################################################
# Prod Dependencies
###############################################################################
FROM base AS prod-dependencies

COPY --from=pruner /usr/app/out/json/ .
COPY --from=pruner /usr/app/out/yarn.lock ./yarn.lock
COPY --from=dependencies /usr/app/${YARN_CACHE_FOLDER} /${YARN_CACHE_FOLDER}

RUN yarn install --frozen-lockfile --production --prefer-offline --ignore-scripts
RUN rm -rf /usr/app/${YARN_CACHE_FOLDER}

###############################################################################
# Build
###############################################################################
FROM base AS builder

COPY --from=dependencies /usr/app/ .
COPY --from=pruner /usr/app/out/full/ .

RUN yarn ci --scope=${SCOPE} --include-dependencies --no-deps
RUN find . -name node_modules | xargs rm -rf

###############################################################################
# Production Image
###############################################################################
FROM node:16-alpine AS production

WORKDIR /app

# Build version metadata
ARG BUILD_SHA
ARG BUILD_BRANCH
ARG BUILD_DATE
ENV BUILD_SHA=${BUILD_SHA}
ENV BUILD_BRANCH=${BUILD_BRANCH}
ENV BUILD_DATE=${BUILD_DATE}

ENV NODE_ENV production

COPY --from=prod-dependencies /usr/app/ .
COPY --from=builder /usr/app/ .

CMD yarn workspace ${SCOPE} start
