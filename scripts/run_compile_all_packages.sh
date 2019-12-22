#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."

# declare packages to compile in order
declare -a packages=("ulangi-common" "ulangi-action" "ulangi-local-database" "ulangi-saga" "ulangi-observable" "ulangi-store" "ulangi-event" "ulangi-remote-database" "ulangi-dictionary" "ulangi-library" "ulangi-script" )
for i in "${packages[@]}"
do
  cd ${PROJECT_DIR}/packages/"$i"
  npm run compile
done

# declare packages that requires to install local packaages before compiling
declare -a packages=("ulangi-server" "ulangi-mobile")
for i in "${packages[@]}"
do
  cd ${PROJECT_DIR}/packages/"$i"
  npm run install-local
  npm run compile
done
