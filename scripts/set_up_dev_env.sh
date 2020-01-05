#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."

# ulangi-server
SERVER_PACKAGE=packages/ulangi-server
cp ${PROJECT_DIR}/${SERVER_PACKAGE}/config/.env.example ${PROJECT_DIR}/${SERVER_PACKAGE}/config/.env.dev

# ulangi-mobile
MOBILE_PACKAGE=packages/ulangi-mobile
cp ${PROJECT_DIR}/${MOBILE_PACKAGE}/config/.env.example ${PROJECT_DIR}/${MOBILE_PACKAGE}/config/.env.dev
cp ${PROJECT_DIR}/${MOBILE_PACKAGE}/ios/GoogleService-Info.example.plist ${PROJECT_DIR}/${MOBILE_PACKAGE}/ios/GoogleService-Info.dev.plist
cp ${PROJECT_DIR}/${MOBILE_PACKAGE}/android/app/src/example/google-services.json ${PROJECT_DIR}/${MOBILE_PACKAGE}/android/app/src/dev/google-services.json
