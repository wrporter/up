###############################################################################
# Image containing all built artifact code
###############################################################################
ARG ARTIFACT_IMAGE
FROM ${ARTIFACT_IMAGE} AS artifact

###############################################################################
# Base image
###############################################################################
FROM node:20-alpine AS base

WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm config set update-notifier false
ARG APP

###############################################################################
# Prune everything except what's necessary for the app
###############################################################################
FROM base AS prune

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY --from=artifact . .
RUN npx turbo prune --scope=${APP} --docker
WORKDIR /app/out/json
RUN npm ci --omit=dev --loglevel=warn
RUN npm prune --omit=dev

###############################################################################
# API test runner
###############################################################################
FROM base as api-tests

COPY --from=prune /app/out/json/node_modules ./node_modules
COPY --from=prune /app/out/full/ ./

WORKDIR /app/apps/${APP}

CMD ["npm", "test"]
