###############################################################################
# Copy all package.json files in the project
# See https://stackoverflow.com/questions/49939960/docker-copy-files-using-glob-pattern
###############################################################################
FROM node:18-alpine as dependencies

WORKDIR /app

COPY package.json package-lock.json ./

COPY packages packages

# Find and remove non package.json files
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

###############################################################################
# Install Dependencies
###############################################################################
FROM node:16-alpine

RUN apk update && apk upgrade && apk add --no-cache curl bash git

WORKDIR /app

COPY --from=dependencies /app .

RUN npm ci --loglevel=warn

COPY . .

ENTRYPOINT []
CMD []
