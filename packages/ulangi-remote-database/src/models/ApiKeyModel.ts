/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ApiScope } from '@ulangi/ulangi-common/enums';
import { User } from '@ulangi/ulangi-common/interfaces';
import * as knex from 'knex';
import * as _ from 'lodash';

import { TableName } from '../enums/TableName';
import { ApiKeyRow } from '../interfaces/ApiKeyRow';
import { UserModel } from '../models/UserModel';
import { ApiKeyRowResolver } from '../resolvers/ApiKeyRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';

export class ApiKeyModel {
  private apiKeyRowResolver = new ApiKeyRowResolver();
  private userModel: UserModel;

  public constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  public getValidApiKeyByUserIdAndScope(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    apiScope: ApiScope
  ): Promise<null | { apiKey: string; expiredAt: Date | null }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.API_KEY)
              .where({ userId, apiScope })
              .whereRaw('(expiredAt IS NULL OR NOW() <= expiredAt)')
              .limit(1)
          );

          const first = _.first(result);
          if (typeof first === 'undefined') {
            resolve(null);
          } else {
            const apiKeyRow = this.apiKeyRowResolver.resolve(first, true);

            resolve({
              apiKey: apiKeyRow.apiKey,
              expiredAt: apiKeyRow.expiredAt,
            });
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getUserByApiKeyAndScope(
    db: knex | knex.Transaction | knex.QueryBuilder,
    apiKey: string,
    apiScope: ApiScope,
    stripUnknown: boolean
  ): Promise<null | {
    user: User;
    shardId: number;
    password: string;
    accessKey: string;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.API_KEY)
              .where({ apiKey, apiScope })
              .limit(1)
          );

          const first = _.first(result);
          if (typeof first === 'undefined') {
            resolve(null);
          } else {
            const apiKeyRow = this.apiKeyRowResolver.resolve(
              first,
              stripUnknown
            );

            resolve(
              await this.userModel.getUserById(
                db,
                apiKeyRow.userId,
                stripUnknown
              )
            );
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public isApiKeyBelongingToUser(
    db: knex | knex.Transaction | knex.QueryBuilder,
    apiKey: string,
    userId: string
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.API_KEY)
              .where({ apiKey, userId })
              .limit(1)
          );

          resolve(result.length > 0);

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public insertApiKey(
    db: knex.Transaction,
    apiKeyRow: ApiKeyRow
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          await promisifyQuery(db.insert(apiKeyRow).into(TableName.API_KEY));

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public deleteApiKey(db: knex.Transaction, apiKey: string): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          await promisifyQuery(
            db
              .delete()
              .from(TableName.API_KEY)
              .where({ apiKey })
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
