#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."
cd "${PROJECT_DIR}"

docker build -t ulangi-test -f Dockerfile.test .
