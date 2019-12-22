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
npm pack ${PROJECT_DIR}/../ulangi-remote-database
npm pack ${PROJECT_DIR}/../ulangi-dictionary
npm pack ${PROJECT_DIR}/../ulangi-library
echo "Packed local packages."
