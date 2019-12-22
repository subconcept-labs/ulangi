import * as detox from 'detox';

import * as config from '../../e2e.config';
import { clearAppData } from './clearAppData';
import { takeScreenshot } from './takeScreenshot';

class Device {
  public isIOS(): boolean {
    return detox.device.getPlatform() === 'ios';
  }

  public isAndroid(): boolean {
    return detox.device.getPlatform() === 'android';
  }

  public async terminateApp(): Promise<void> {
    await detox.device.terminateApp();
  }

  public async launchApp(): Promise<void> {
    await detox.device.launchApp({ newInstance: true });
  }

  public async restartApp(): Promise<void> {
    await this.terminateApp();
    await this.launchApp();
  }

  public getBundleId(): string {
    return config.bundleId;
  }

  public getAppPackage(): string {
    return config.appPackage;
  }

  public getAppActivity(): string {
    return config.appActitivy;
  }

  public pause(ms: number): Promise<void> {
    return new Promise(
      (resolve): void => {
        setTimeout(resolve, ms);
      }
    );
  }

  public async clearAppData(): Promise<void> {
    return clearAppData();
  }

  public async takeScreenshot(fileName: string): Promise<void> {
    return takeScreenshot(fileName);
  }

  public async disableSynchronization(): Promise<void> {
    await detox.device.disableSynchronization();
  }

  public async enableSynchronization(): Promise<void> {
    await detox.device.enableSynchronization();
  }
}

export const device = new Device();
