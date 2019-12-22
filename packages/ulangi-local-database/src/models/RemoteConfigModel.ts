/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { DefaultRemoteConfig } from '@ulangi/ulangi-common/constants';
import { RemoteConfig } from '@ulangi/ulangi-common/interfaces';
import { RemoteConfigResolver } from '@ulangi/ulangi-common/resolvers';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { TableName } from '../enums/TableName';

export class RemoteConfigModel {
  private remoteConfigResolver = new RemoteConfigResolver();

  public constructor(remoteConfigResolver = new RemoteConfigResolver()) {
    this.remoteConfigResolver = remoteConfigResolver;
  }

  // If remote config is null or not resolvable,
  // then default values will be used instead
  public getRemoteConfig(
    db: SQLiteDatabase,
    stripUnknown: boolean
  ): Promise<RemoteConfig> {
    return new Promise(
      async (resolve): Promise<void> => {
        try {
          const result = await db.executeSql(
            `
          SELECT * FROM ${
            TableName.SESSION
          } WHERE sessionKey = 'remoteConfig' LIMIT 1
        `,
            []
          );
          if (result.rows.length === 1) {
            const item = result.rows[0];
            const remoteConfig = this.remoteConfigResolver.resolve(
              // Do not use _.merge as it also merges array
              _.assign(DefaultRemoteConfig, JSON.parse(item.sessionValue)),
              stripUnknown
            );

            resolve(remoteConfig);
          } else {
            resolve(DefaultRemoteConfig);
          }
        } catch (error) {
          console.log(error);
          resolve(DefaultRemoteConfig);
        }
      }
    );
  }

  public getLastFetchTime(db: SQLiteDatabase): Promise<null | number> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await db.executeSql(
            `
          SELECT * FROM ${
            TableName.SESSION
          } WHERE sessionKey = 'remoteConfigLastFetchedAt' LIMIT 1
        `,
            []
          );
          if (result.rows.length === 1) {
            const item = result.rows[0];
            const lastFetchTime = Joi.attempt(item.sessionValue, Joi.number());
            resolve(parseInt(lastFetchTime));
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public insertRemoteConfig(tx: Transaction, remoteConfig: RemoteConfig): void {
    tx.executeSql(
      `
      INSERT OR REPLACE INTO ${TableName.SESSION} VALUES ('remoteConfig', ?)
    `,
      [JSON.stringify(remoteConfig)]
    );
  }

  public insertLastFetchTime(tx: Transaction, timestamp: number): void {
    tx.executeSql(
      `
      INSERT OR REPLACE INTO ${
        TableName.SESSION
      } VALUES ('remoteConfigLastFetchedAt', ?)
    `,
      [timestamp.toString()]
    );
  }
}
