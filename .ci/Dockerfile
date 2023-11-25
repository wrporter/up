###############################################################################
# Copy all package.json files in the project
# See https://stackoverflow.com/questions/49939960/docker-copy-files-using-glob-pattern
###############################################################################
FROM alpine:3.20 as dependencies

WORKDIR /app

COPY package.json package-lock.json ./

COPY packages packages

# Find and remove non package.json files
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

###############################################################################
# Install Dependencies
###############################################################################
FROM node:20-alpine

RUN apk update && apk upgrade && apk add --no-cache curl bash git libc6-compat

WORKDIR /app

COPY --from=dependencies /app .

RUN npm ci --loglevel=warn

COPY . .

ENTRYPOINT []
CMD []
