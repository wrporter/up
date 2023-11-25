###############################################################################
# Base image
###############################################################################
FROM node:20-alpine AS base

WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm config set update-notifier false
ARG APP

###############################################################################
# Turbo
###############################################################################
FROM base AS turbo

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# TODO: Fix Turborepo caching
ARG TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TEAM $TURBO_TEAM
ENV TURBO_TOKEN $TURBO_TOKEN

RUN npm install --global turbo

###############################################################################
# Prune everything except what's necessary for the app
###############################################################################
FROM turbo AS prune

COPY . .

RUN turbo prune --scope=${APP} --docker

###############################################################################
# All Dependencies
###############################################################################
FROM base AS dependencies

COPY --from=prune /app/out/json/ .

RUN npm ci --loglevel=warn

###############################################################################
# Build
###############################################################################
FROM turbo AS build

COPY --from=dependencies /app/ .
COPY --from=prune /app/out/full/ .

RUN turbo run lint typecheck test build --filter=${APP}...

RUN npm prune --omit=dev

###############################################################################
# Production image
###############################################################################
FROM base AS production

# Build version metadata
ARG APP_ID
ARG BUILD_BRANCH
ARG BUILD_SHA
ARG BUILD_VERSION
ARG BUILD_DATE
ENV APP_ID=$APP_ID
ENV BUILD_BRANCH=$BUILD_BRANCH
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_VERSION=$BUILD_VERSION
ENV BUILD_DATE=$BUILD_DATE

ENV NODE_ENV production

COPY --from=build /app/ .
#RUN mv .prisma node_modules/.prisma

# Can we prune without having to install dependencies again?
#COPY --from=prune /app/node_modules ./node_modules
##COPY --from=prune /app/out/json/node_modules ./node_modules
## TODO: Can we optimize the package copy so we only copy over built assets?
#COPY --from=prune /app/out/full/packages ./packages
#COPY --from=prune /app/apps/${APP}/node_modules ./apps/${APP}/node_modules
#COPY --from=prune /app/apps/${APP}/build apps/${APP}/build
#COPY --from=prune /app/apps/${APP}/public apps/${APP}/public
#COPY --from=prune /app/apps/${APP}/prisma apps/${APP}/prisma

WORKDIR "apps/${APP}"

CMD node build/main.js
