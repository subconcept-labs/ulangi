#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."
PACKAGE_VERSION=$(node -p -e "require('${PROJECT_DIR}/package.json').version")

cd ${PROJECT_DIR}/local-packages

echo "Installing packed local packages..."
npm install --no-save --only=production \
  $( find . -type f -name "ulangi-ulangi-common-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-action-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-local-database-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-saga-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-event-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-observable-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-store-*.tgz" -print -quit ) \
  $( find . -type f -name "ulangi-ulangi-delegate-*.tgz" -print -quit )
echo "Installed local packages."
