###############################################################################
# Image containing all built artifact code
###############################################################################
ARG ARTIFACT_IMAGE
FROM ${ARTIFACT_IMAGE} AS artifact

###############################################################################
# Built assets with an image ready to run commands
###############################################################################
FROM node:20-alpine AS base

WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm config set update-notifier false

COPY --from=artifact . .

ENTRYPOINT []
CMD []
