/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { RemoteConfig } from '@ulangi/ulangi-common/interfaces';
import { RemoteConfigResolver } from '@ulangi/ulangi-common/resolvers';
import * as appRoot from 'app-root-path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

export class RemoteConfigFacade {
  private remoteConfigResolver = new RemoteConfigResolver();
  private cachedRemoteConfig?: RemoteConfig;

  public async getRemoteConfig(): Promise<RemoteConfig> {
    return new Promise(
      (resolve, reject): void => {
        if (typeof this.cachedRemoteConfig !== 'undefined') {
          resolve(this.cachedRemoteConfig);
        } else {
          const remoteConfigFile = path.join(
            appRoot.toString(),
            'config',
            'remote-config.yml'
          );

          fs.readFile(
            remoteConfigFile,
            'utf8',
            (error, data): void => {
              if (error) {
                reject(error);
              } else {
                this.cachedRemoteConfig = this.remoteConfigResolver.resolve(
                  yaml.safeLoad(data),
                  true
                );
                resolve(this.cachedRemoteConfig);
              }
            }
          );
        }
      }
    );
  }
}
