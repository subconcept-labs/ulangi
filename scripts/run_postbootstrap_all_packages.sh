#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."

cd packages

echo "Executing postbootstrap script of each package..."
for d in */ ; do
  cd ${PROJECT_DIR}/packages/$d
  npm run postbootstrap --if-present || exit 1
done
echo "Executed postbootstrap script of each package."
