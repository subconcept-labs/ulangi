/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { RemoteConfig } from '@ulangi/ulangi-common/interfaces';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { RemoteConfigModel } from '../models/RemoteConfigModel';

describe('RemoteConfigModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let remoteConfigModel: RemoteConfigModel;
    let databaseFacade: DatabaseFacade;
    let sharedDb: SQLiteDatabase;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(new SQLiteDatabaseAdapter(sqlite3));
        await databaseFacade.connectSharedDb((await tmp.file()).path);
        await databaseFacade.checkSharedDb();
        sharedDb = databaseFacade.getDb('shared');

        remoteConfigModel = new RemoteConfigModel();
      }
    );

    describe('Tests start after inserting remote config', (): void => {
      let remoteConfig: RemoteConfig;

      beforeEach(
        async (): Promise<void> => {
          remoteConfig = {
            languages: [],
            supportedLanguagePairs: [],
            app: {
              showInAppRatingAfterDays: 15,
            },
            sync: {
              uploadLimit: 20,
              downloadLimit: 40,
              minDelay: 1000,
              maxDelay: 30000,
              incrementDelayOnError: 5000,
            },
            ad: {
              numOfTermsToReviewBeforeShowingAds: 30,
            },
          };
          await sharedDb.transaction(
            (tx): void => {
              remoteConfigModel.insertRemoteConfig(tx, remoteConfig);
            }
          );
        }
      );

      test('get remote config', async (): Promise<void> => {
        const fetchedRemoteConfig = await remoteConfigModel.getRemoteConfig(
          sharedDb,
          true
        );
        expect(fetchedRemoteConfig).toEqual(remoteConfig);
      });
    });

    describe('Tests start after inserting last fetch time', (): void => {
      let lastFetchTime: number;
      beforeEach(
        async (): Promise<void> => {
          lastFetchTime = moment().unix();

          await sharedDb.transaction(
            (tx): void => {
              remoteConfigModel.insertLastFetchTime(tx, lastFetchTime);
            }
          );
        }
      );

      test('get last fetch time', async (): Promise<void> => {
        const fetchedLastFetchTime = await remoteConfigModel.getLastFetchTime(
          sharedDb
        );
        expect(fetchedLastFetchTime).toEqual(lastFetchTime);
      });
    });
  });
});
