/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';
import * as uuid from 'uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { SessionModel } from '../models/SessionModel';

describe('SessionModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let sessionModel: SessionModel;
    let databaseFacade: DatabaseFacade;
    let sharedDb: SQLiteDatabase;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(new SQLiteDatabaseAdapter(sqlite3));
        await databaseFacade.connectSharedDb((await tmp.file()).path);
        await databaseFacade.checkSharedDb();
        sharedDb = databaseFacade.getDb('shared');

        sessionModel = new SessionModel();
      }
    );

    describe('Tests start after inserting some session key value', (): void => {
      beforeEach(
        async (): Promise<void> => {
          await sharedDb.transaction(
            (tx): void => {
              sessionModel.upsertUserId(tx, 'userId');
              sessionModel.upsertAccessToken(tx, 'accessToken');
            }
          );
        }
      );

      test('delete all session values', async (): Promise<void> => {
        await sharedDb.transaction(
          (tx): void => {
            sessionModel.deleteAllSessionValues(tx);
          }
        );

        const fetchedUserId = await sessionModel.getUserId(sharedDb);
        expect(fetchedUserId).toBeNull();

        const fetchedAccessToken = await sessionModel.getAccessToken(sharedDb);
        expect(fetchedAccessToken).toBeNull();
      });
    });

    describe('Tests start after inserting userId', (): void => {
      let userId: string;
      beforeEach(
        async (): Promise<void> => {
          userId = uuid.v4();
          await sharedDb.transaction(
            (tx): void => {
              sessionModel.upsertUserId(tx, userId);
            }
          );
        }
      );

      test('get user id', async (): Promise<void> => {
        const fetchedUserId = await sessionModel.getUserId(sharedDb);
        expect(fetchedUserId).toEqual(userId);
      });

      test('upsert existing user id', async (): Promise<void> => {
        const newUserId = uuid.v4();
        await sharedDb.transaction(
          (tx): void => {
            sessionModel.upsertUserId(tx, newUserId);
          }
        );

        const fetchedUserId = await sessionModel.getUserId(sharedDb);
        expect(fetchedUserId).toEqual(newUserId);
      });
    });

    describe('Tests start after inserting accessToken', (): void => {
      let accessToken: string;
      beforeEach(
        async (): Promise<void> => {
          accessToken = uuid.v4();
          await sharedDb.transaction(
            (tx): void => {
              sessionModel.upsertAccessToken(tx, accessToken);
            }
          );
        }
      );

      test('get access token', async (): Promise<void> => {
        const fetchedAccessToken = await sessionModel.getAccessToken(sharedDb);
        expect(fetchedAccessToken).toEqual(accessToken);
      });

      test('upsert existing access token', async (): Promise<void> => {
        const newAccessToken = uuid.v4();
        await sharedDb.transaction(
          (tx): void => {
            sessionModel.upsertAccessToken(tx, newAccessToken);
          }
        );

        const fetchedAccessToken = await sessionModel.getAccessToken(sharedDb);
        expect(fetchedAccessToken).toEqual(newAccessToken);
      });
    });

    describe('Tests start after inserting spacedRepetitionTermPosition', (): void => {
      let spacedRepetitionTermPosition: number;
      beforeEach(
        async (): Promise<void> => {
          spacedRepetitionTermPosition = 4;
          await sharedDb.transaction(
            (tx): void => {
              sessionModel.upsertSpacedRepetitionTermPosition(
                tx,
                'setId',
                spacedRepetitionTermPosition
              );
            }
          );
        }
      );

      test('get spaced repetition term position', async (): Promise<void> => {
        const fetchedSpacedRepetitionTermPosition = await sessionModel.getSpacedRepetitionTermPosition(
          sharedDb,
          'setId'
        );
        expect(fetchedSpacedRepetitionTermPosition).toEqual(
          spacedRepetitionTermPosition
        );
      });

      test('upsert existing spaced repetition term position', async (): Promise<
        void
      > => {
        const newSpacedRepetitionTermPosition = 8;
        await sharedDb.transaction(
          (tx): void => {
            sessionModel.upsertSpacedRepetitionTermPosition(
              tx,
              'setId',
              newSpacedRepetitionTermPosition
            );
          }
        );

        const fetchedSpacedRepetitionTermPosition = await sessionModel.getSpacedRepetitionTermPosition(
          sharedDb,
          'setId'
        );
        expect(fetchedSpacedRepetitionTermPosition).toEqual(
          newSpacedRepetitionTermPosition
        );
      });
    });

    describe('Tests start after inserting writingTermPosition', (): void => {
      let writingTermPosition: number;
      beforeEach(
        async (): Promise<void> => {
          writingTermPosition = 4;
          await sharedDb.transaction(
            (tx): void => {
              sessionModel.upsertWritingTermPosition(
                tx,
                'setId',
                writingTermPosition
              );
            }
          );
        }
      );

      test('get writing term position', async (): Promise<void> => {
        const fetchedWritingTermPosition = await sessionModel.getWritingTermPosition(
          sharedDb,
          'setId'
        );
        expect(fetchedWritingTermPosition).toEqual(writingTermPosition);
      });

      test('upsert existing writing term position', async (): Promise<void> => {
        const newWritingTermPosition = 8;
        await sharedDb.transaction(
          (tx): void => {
            sessionModel.upsertWritingTermPosition(
              tx,
              'setId',
              newWritingTermPosition
            );
          }
        );

        const fetchedWritingTermPosition = await sessionModel.getWritingTermPosition(
          sharedDb,
          'setId'
        );
        expect(fetchedWritingTermPosition).toEqual(newWritingTermPosition);
      });
    });
  });
});
