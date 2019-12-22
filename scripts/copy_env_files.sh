#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."

DESTINATION_DIR="$(pwd)/$1"

# copy env files of ulangi-remote-database
REMOTE_DATABASE_TEST_ENV_FILE=packages/ulangi-remote-database/config/.env.test

cp ${PROJECT_DIR}/${REMOTE_DATABASE_TEST_ENV_FILE} ${DESTINATION_DIR}/${REMOTE_DATABASE_TEST_ENV_FILE}

# copy env files of ulangi-server
SERVER_DEV_ENV_FILE=packages/ulangi-server/config/.env.dev
SERVER_TEST_ENV_FILE=packages/ulangi-server/config/.env.test
SERVER_E2E_TEST_ENV_FILE=packages/ulangi-server/e2e/config/.env.test
FIREBASE_SERVICE_ACCOUNT_FILE=packages/ulangi-server/config/firebase-sa.dev.json
GOOGLE_CLOUD_SERVICE_ACCOUNT_FILE=packages/ulangi-server/config/google-cloud-sa.json
PLAY_STORE_SERVICE_ACCOUNT_FILE=packages/ulangi-server/config/play-store-sa.json
NPMRC_FILE=packages/ulangi-server/.npmrc

cp ${PROJECT_DIR}/${SERVER_DEV_ENV_FILE} ${DESTINATION_DIR}/${SERVER_DEV_ENV_FILE}
cp ${PROJECT_DIR}/${SERVER_TEST_ENV_FILE} ${DESTINATION_DIR}/${SERVER_TEST_ENV_FILE}
cp ${PROJECT_DIR}/${SERVER_E2E_TEST_ENV_FILE} ${DESTINATION_DIR}/${SERVER_E2E_TEST_ENV_FILE}
cp ${PROJECT_DIR}/${FIREBASE_SERVICE_ACCOUNT_FILE} ${DESTINATION_DIR}/${FIREBASE_SERVICE_ACCOUNT_FILE}
cp ${PROJECT_DIR}/${GOOGLE_CLOUD_SERVICE_ACCOUNT_FILE} ${DESTINATION_DIR}/${GOOGLE_CLOUD_SERVICE_ACCOUNT_FILE}
cp ${PROJECT_DIR}/${PLAY_STORE_SERVICE_ACCOUNT_FILE} ${DESTINATION_DIR}/${PLAY_STORE_SERVICE_ACCOUNT_FILE}
cp ${PROJECT_DIR}/${NPMRC_FILE} ${DESTINATION_DIR}/${NPMRC_FILE}

# copy env files of ulangi-mobile
APP_ENV_FILE=packages/ulangi-mobile/config/.env.dev
GOOGLE_SERVILE_INFO_PLIST_FILE=packages/ulangi-mobile/ios/GoogleService-Info.dev.plist 
GOOGLE_SERVILES_FILE=packages/ulangi-mobile/android/app/src/dev/google-services.json

cp ${PROJECT_DIR}/${APP_ENV_FILE} ${DESTINATION_DIR}/${APP_ENV_FILE}
cp ${PROJECT_DIR}/${GOOGLE_SERVILE_INFO_PLIST_FILE} ${DESTINATION_DIR}/${GOOGLE_SERVILE_INFO_PLIST_FILE}
cp ${PROJECT_DIR}/${GOOGLE_SERVILES_FILE} ${DESTINATION_DIR}/${GOOGLE_SERVILES_FILE}
