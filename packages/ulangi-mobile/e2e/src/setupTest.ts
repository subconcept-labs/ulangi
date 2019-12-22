import * as detox from 'detox';
import * as adapter from 'detox/runners/jest/adapter';

import * as config from '../e2e.config.js';
import * as packageFile from '../package.json';
import { device } from './adapters/device';

jest.setTimeout(config.testTimeout);
// eslint-disable-next-line
jasmine.getEnv().addReporter(adapter);

beforeAll(
  async (): Promise<void> => {
    await detox.init(packageFile.detox);
  }
);

beforeEach(
  async (): Promise<void> => {
    return new Promise(async(resolve, reject): Promise<void> => {
      try {
        await adapter.beforeEach();
        await device.clearAppData();
        await device.launchApp();
        resolve()
      }
      catch (error){
        reject(error)
      }
    })
  }
);

afterAll(
  async (): Promise<void> => {
    await adapter.afterAll();
    await detox.cleanup();
  }
);
