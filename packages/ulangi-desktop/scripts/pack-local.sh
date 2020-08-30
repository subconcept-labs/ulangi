#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."

cd $PROJECT_DIR

# Clean local-packages
/bin/rm -Rf local-packages
mkdir local-packages

cd local-packages

echo "Packing local packages..."
npm pack ${PROJECT_DIR}/../ulangi-common
npm pack ${PROJECT_DIR}/../ulangi-action
npm pack ${PROJECT_DIR}/../ulangi-local-database
npm pack ${PROJECT_DIR}/../ulangi-saga
npm pack ${PROJECT_DIR}/../ulangi-event
npm pack ${PROJECT_DIR}/../ulangi-observable
npm pack ${PROJECT_DIR}/../ulangi-store
npm pack ${PROJECT_DIR}/../ulangi-delegate
echo "Packed local packages."
