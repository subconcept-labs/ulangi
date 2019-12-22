#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."
PACKAGE_VERSION=$(node -p -e "require('${PROJECT_DIR}/package.json').version")

INFO_PLIST_FILE="ios/Info.plist"
RESULT=$(/usr/libexec/PlistBuddy -c "SET :CFBundleShortVersionString ${PACKAGE_VERSION}" ${PROJECT_DIR}/${INFO_PLIST_FILE} 2>&1)
if [ $? -eq 0 ]; then
  echo "Updated :CFBundleShortVersionString in ${INFO_PLIST_FILE} to $PACKAGE_VERSION"
else
  echo "Error occurred: ${RESULT}"
fi

BUILD_GRADLE_FILE="android/app/build.gradle"
RESULT=$(sed -i '' 's/versionName ".*\..*\..*"/versionName "'$PACKAGE_VERSION'"/' ${PROJECT_DIR}/${BUILD_GRADLE_FILE} 2>&1)
if [ $? -eq 0 ]; then
  echo "Updated versionName in $BUILD_GRADLE_FILE to $PACKAGE_VERSION"
else
  echo "Error occurred: ${RESULT}"
fi

