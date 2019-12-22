#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."
cd "${PROJECT_DIR}/e2e"

npm test
