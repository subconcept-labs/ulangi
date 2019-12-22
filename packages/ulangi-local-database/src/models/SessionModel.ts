/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import * as squel from 'squel';

import { TableName } from '../enums/TableName';

export class SessionModel {
  public getUserId(db: SQLiteDatabase): Promise<null | string> {
    return this.getValueFromSession(db, 'userId');
  }

  public getAccessToken(db: SQLiteDatabase): Promise<null | string> {
    return this.getValueFromSession(db, 'accessToken');
  }

  public getSpacedRepetitionTermPosition(
    db: SQLiteDatabase,
    setId: string
  ): Promise<null | number> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const termPosition = await this.getValueFromSession(
            db,
            'spacedRepetitionTermPosition_for_set_' + setId
          );
          if (termPosition === null) {
            resolve(null);
          } else {
            resolve(parseInt(termPosition));
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getWritingTermPosition(
    db: SQLiteDatabase,
    setId: string
  ): Promise<null | number> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const termPosition = await this.getValueFromSession(
            db,
            'writingTermPosition_for_set_' + setId
          );
          if (termPosition === null) {
            resolve(null);
          } else {
            resolve(parseInt(termPosition));
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertUserId(tx: Transaction, userId: string): void {
    return this.upsertSession(tx, 'userId', userId);
  }

  public upsertAccessToken(tx: Transaction, accessToken: string): void {
    return this.upsertSession(tx, 'accessToken', accessToken);
  }

  public upsertSpacedRepetitionTermPosition(
    tx: Transaction,
    setId: string,
    termPosition: number
  ): void {
    return this.upsertSession(
      tx,
      'spacedRepetitionTermPosition_for_set_' + setId,
      termPosition.toString()
    );
  }

  public upsertWritingTermPosition(
    tx: Transaction,
    setId: string,
    termPosition: number
  ): void {
    return this.upsertSession(
      tx,
      'writingTermPosition_for_set_' + setId,
      termPosition.toString()
    );
  }

  public deleteAllSessionValues(tx: Transaction): void {
    const query = squel
      .delete()
      .from(TableName.SESSION)
      .toParam();
    tx.executeSql(query.text, query.values);
  }

  private getValueFromSession(
    db: SQLiteDatabase,
    sessionKey: string
  ): Promise<null | string> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.SESSION)
            .where('sessionKey = ?', sessionKey)
            .toParam();
          const result = await db.executeSql(query.text, query.values);
          if (result.rows.length === 1) {
            const item = result.rows[0];
            resolve(item.sessionValue);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private upsertSession(
    tx: Transaction,
    sessionKey: string,
    sessionValue: null | string
  ): void {
    const insertOrIgnoreQuery = squel
      .insertOrIgnore()
      .into(TableName.SESSION)
      .set('sessionKey', sessionKey)
      .set('sessionValue', sessionValue)
      .toParam();

    const updateQuery = squel
      .update()
      .table(TableName.SESSION)
      .set('sessionValue', sessionValue)
      .where('sessionKey = ?', sessionKey)
      .toParam();

    tx.executeSql(insertOrIgnoreQuery.text, insertOrIgnoreQuery.values);
    tx.executeSql(updateQuery.text, updateQuery.values);
  }
}
