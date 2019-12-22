#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."
PACKAGE_VERSION=$(node -p -e "require('${PROJECT_DIR}/package.json').version")

cd ${PROJECT_DIR}/local-packages

echo "Installing packed local packages..."
npm install --no-save --only=production \
  $( find . -type f -name "ulangi-ulangi-common-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-remote-database-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-dictionary-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-library-*.tgz" -print -quit ) 
echo "Installed local packages."
