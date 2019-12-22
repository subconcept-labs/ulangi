import { exec } from 'child_process';

import * as config from '../../e2e.config.js';
import { device } from '../adapters/Device';

export async function takeScreenshot(fileName: string): Promise<void> {
  if (device.isIOS()) {
    await takeScreenshotForIOS(fileName);
  } else {
    await takeScreenshotForAndroid(fileName);
  }
}

function takeScreenshotForIOS(fileName: string): Promise<void> {
  return new Promise(
    async (resolve): Promise<void> => {
      await makeDir(`${config.screenshotDir}/ios`);
      exec(
        `xcrun simctl io booted screenshot ${config.screenshotDir +
          '/ios/' +
          fileName}.png`,
        (error, stdout, stderr): void => {
          if (error || stderr) {
            console.log(error || stderr);
          }
          resolve();
        }
      );
    }
  );
}

function takeScreenshotForAndroid(fileName: string): Promise<void> {
  return new Promise(
    async (resolve): Promise<void> => {
      await makeDir(`${config.screenshotDir}/android`);
      exec(
        `adb exec-out screencap -p > ${config.screenshotDir +
          '/android/' +
          fileName}.png`,
        (error, stdout, stderr): void => {
          if (error || stderr) {
            console.log(error || stderr);
          }
          resolve();
        }
      );
    }
  );
}

function makeDir(dir: string): Promise<void> {
  return new Promise(
    (resolve, reject): void => {
      exec(
        `mkdir -p ${dir}`,
        (error, stdout, stderr): void => {
          if (error || stderr) {
            console.log(error || stderr);
            reject(error || stderr);
          }
          resolve();
        }
      );
    }
  );
}
