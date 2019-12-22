import { exec } from 'child_process';
import * as rimraf from 'rimraf';

import { device } from '../adapters/device';

export async function clearAppData(): Promise<void> {
  if (device.isIOS()) {
    await clearIOSAppData(device.getBundleId());
  } else {
    await clearAndroidAppData(device.getAppPackage());
  }
}

function clearIOSAppData(bundleId: string): Promise<void> {
  return new Promise(
    async (resolve, reject): Promise<void> => {
      exec(
        `xcrun simctl get_app_container booted ${bundleId} data`,
        (error, stdout, stderr): void => {
          if (error || stderr) {
            reject(
              `Failed to clear app data on iOS. Please check app bundle id. Error message: ${error ||
                stderr}`
            );
          } else {
            const result = stdout.toString();
            if (result !== '') {
              const localDatabasePath =
                removeNewLinesAndSpaces(result) + '/Library/LocalDatabase';
              rimraf(
                localDatabasePath,
                (error): void => {
                  if (error) {
                    reject(
                      `Failed to delete folder ${localDatabasePath}. Error message: ${error}`
                    );
                  } else {
                    resolve();
                  }
                }
              );
            } else {
              reject(
                `Failed to clear app data on iOS. App data path is empty.`
              );
            }
          }
        }
      );
    }
  );
}

async function clearAndroidAppData(appPackage: string): Promise<void> {
  return new Promise(
    async (resolve, reject): Promise<void> => {
      exec(
        `adb shell pm clear ${appPackage}`,
        //`echo "rm -rf databases" | adb shell run-as ${appPackage}`,
        (error, stdout, stderr): void => {
          if (error || stderr) {
            reject(
              `Failed to clear app data on android. Please check app package id. Error message: ${error ||
                stderr}`
            );
          } else {
            const message = removeNewLinesAndSpaces(stdout.toString());
            if (message === 'Success') {
              resolve();
            } else {
              reject(
                `App data on android may not be removed. See message: ${message}`
              );
            }
          }
        }
      );
    }
  );
}

function removeNewLinesAndSpaces(str: string): string {
  return str.replace(/(\r\n|\n|\r)/gm, '').trim();
}
