import { exec } from 'child_process';

import { device } from '../adapters/device';

export async function launchAppNoReset(): Promise<void> {
  if (device.isIOS()) {
    await launchAppOnIOS(device.getBundleId());
  } else {
    await launchAppOnAndroid(device.getAppPackage(), device.getAppActivity());
  }
}

function launchAppOnIOS(iosAppBundleId: string): Promise<void> {
  return new Promise(
    async (resolve, reject): Promise<void> => {
      exec(
        `xcrun simctl launch booted ${iosAppBundleId}`,
        (error, stdout, stderr): void => {
          if (error || stderr) {
            reject(
              `Failed to launch app on iOS. Please check app bundle id. Error message: ${error ||
                stderr}`
            );
          } else {
            resolve();
          }
        }
      );
    }
  );
}

async function launchAppOnAndroid(
  androidPackageId: string,
  activityName: string
): Promise<void> {
  return new Promise(
    async (resolve, reject): Promise<void> => {
      exec(
        `adb shell pm start -n ${androidPackageId}/${activityName}`,
        //`echo "rm -rf databases" | adb shell run-as ${androidPackageId}`,
        (error, stdout, stderr): void => {
          if (error || stderr) {
            reject(
              `Failed to launch on android. Please check app package id and activity name. Error message: ${error ||
                stderr}`
            );
          } else {
            resolve();
          }
        }
      );
    }
  );
}
