# Continuous Integration

This directory contains scripts for building the project via Continuous Integration (CI) on Docker. Pipelines are also included for Continuous Delivery (CD).

## Files

### Docker

- [`build.sh`](build.sh): Builds the Docker image as specified by the Dockerfile.
- [`cleanup.sh`](cleanup.sh): Used for cleaning up before or after a Docker build, removing images that were built.
- [`config.sh`](config.sh): Contains configuration that is project-specific. Any config should be placed in this file and referenced from other scripts.
- [`Dockerfile`](Dockerfile): The Dockerfile that contains the appropriate build steps for the project. This file will differ the most across project-portfolios, particularly across technology stacks.
- [`publish.sh`](publish.sh): A script that can be used to publish a package to the npm registry.
- [`run.sh`](run.sh): Runs a Docker container locally. Useful for testing out the Docker image with various commands.
