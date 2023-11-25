###############################################################################
# Base image
###############################################################################
FROM node:20-alpine AS base

ARG TURBO_REMOTE_CACHE_SIGNATURE_KEY
ENV TURBO_REMOTE_CACHE_SIGNATURE_KEY $TURBO_REMOTE_CACHE_SIGNATURE_KEY

WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm config set update-notifier false

###############################################################################
# Copy over dependency files to prepare for install
###############################################################################
FROM base AS dependencies

COPY . .

# Find and remove non-package.json files
RUN find apps packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

###############################################################################
# Install dependencies and build
###############################################################################
FROM base AS build

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY --from=dependencies /app .
RUN npm ci --loglevel=warn

COPY . .

#FROM build as target
#COPY --from=build . .
RUN npm run ci

# TODO: Publish packages. Do we need to use changesets?

###############################################################################
# Export test results for main app
###############################################################################
FROM scratch AS test-results

COPY --from=build /app/apps/main/junit.xml ./
COPY --from=build /app/apps/main/coverage/cobertura-coverage.xml ./

###############################################################################
# Built artifacts
###############################################################################
FROM scratch AS artifact

COPY --from=build /app .
