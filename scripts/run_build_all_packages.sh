#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."

# declare packages to compile in order
declare -a packages=("ulangi-common" "ulangi-action" "ulangi-local-database" "ulangi-saga" "ulangi-observable" "ulangi-store" "ulangi-event" "ulangi-remote-database" "ulangi-dictionary" "ulangi-library" "ulangi-script" "ulangi-delegate")
for i in "${packages[@]}"
do
  cd ${PROJECT_DIR}/packages/"$i"
  npm run build || exit 1
done

# declare packages that requires to install local packaages before compiling
declare -a packages=("ulangi-server" "ulangi-mobile" "ulangi-desktop")
for i in "${packages[@]}"
do
  cd ${PROJECT_DIR}/packages/"$i"
  npm run install-local || exit 1
  npm run build || exit 1
done
