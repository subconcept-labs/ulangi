#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."
cd "${PROJECT_DIR}"

docker run \
  -it \
  -p 8082:8082 \
  --env-file ./config/.env.test \
  -v $(pwd):/var/current/app \
  -v /var/current/app/node_modules/ \
  ulangi-test


# This version below uses symlink for ulangi-common;
# however, we should not use this before we setup CI 
# to avoid deploying incorrect version for production
# docker run \
#   -it \
#   -p 8082:8082 \
#   --env-file ./config/.env.test \
#   -v $(pwd):/var/current/app \
#   -v /var/current/app/node_modules/ \
#   -v $(pwd)/node_modules/@ulangi/ulangi-common:/var/current/app/node_modules/@ulangi/ulangi-common \
#   ulangi-test
