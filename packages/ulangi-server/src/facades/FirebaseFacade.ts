/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  SetModel,
  UserModel,
  VocabularyModel,
} from '@ulangi/ulangi-remote-database';
import * as appRoot from 'app-root-path';
import * as admin from 'firebase-admin';
import * as knex from 'knex';
import * as path from 'path';

export class FirebaseFacade {
  private userModel: UserModel;
  private vocabularyModel: VocabularyModel;
  private setModel: SetModel;

  public constructor(
    firebaseServiceAccountPath: string,
    firebaseDatabaseUrl: string,
    userModel: UserModel,
    setModel: SetModel,
    vocabularyModel: VocabularyModel
  ) {
    // eslint-disable-next-line
    const serviceAccount = require(path.join(
      appRoot.toString(),
      firebaseServiceAccountPath
    ));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: firebaseDatabaseUrl,
    });

    this.userModel = userModel;
    this.setModel = setModel;
    this.vocabularyModel = vocabularyModel;
  }

  public createUser(userId: string): Promise<admin.auth.UserRecord> {
    return admin.auth().createUser({
      uid: userId,
    });
  }

  public createCustomToken(userId: string): Promise<string> {
    return admin.auth().createCustomToken(userId);
  }

  public userExists(userId: string): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          await admin.auth().getUser(userId);
          resolve(true);
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            resolve(false);
          } else {
            reject(error);
          }
        }
      }
    );
  }

  public async notifyUserChange(authDb: knex, userId: string): Promise<void> {
    const userLatestSyncTime = await this.userModel.getLatestSyncTime(
      authDb,
      userId
    );
    await this.updateData(userId, { userLatestSyncTime });
  }

  public async notifySetChange(shardDb: knex, userId: string): Promise<void> {
    const setLatestSyncTime = await this.setModel.getLatestSyncTime(
      shardDb,
      userId
    );

    await this.updateData(userId, { setLatestSyncTime });
  }

  public async notifyVocabularyChange(
    shardDb: knex,
    userId: string
  ): Promise<void> {
    const vocabularyLatestSyncTime = await this.vocabularyModel.getLatestSyncTime(
      shardDb,
      userId
    );

    await this.updateData(userId, { vocabularyLatestSyncTime });
  }

  private updateData(
    userId: string,
    data: { [P in string]: any }
  ): Promise<void> {
    return admin
      .database()
      .ref(`users/${userId}`)
      .update(data);
  }
}
