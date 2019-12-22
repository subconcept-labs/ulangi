#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."

cd packages

echo "Executing prebootstrap script of each package..."
for d in */ ; do
  cd ${PROJECT_DIR}/packages/$d
  npm run prebootstrap --if-present
done
echo "Executed prebootstrap script of each package."
