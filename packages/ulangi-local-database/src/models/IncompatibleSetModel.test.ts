/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder } from '@ulangi/ulangi-common/builders';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { IncompatibleSetModel } from './IncompatibleSetModel';
import { SetModel } from './SetModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('IncompatibleSetModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let mockedDatabaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let incompatibleSetModel: IncompatibleSetModel;
    let restoreCurrentTime: () => void;

    beforeEach(
      async (): Promise<void> => {
        mockedDatabaseEventBus = new DatabaseEventBusMock();

        databaseFacade = new DatabaseFacade(new SQLiteDatabaseAdapter(sqlite3));
        await databaseFacade.connectUserDb((await tmp.file()).path);
        await databaseFacade.checkUserDb();
        userDb = databaseFacade.getDb('user');

        modelFactory = new ModelFactory(mockedDatabaseEventBus);

        setModel = modelFactory.createModel('setModel');
        incompatibleSetModel = modelFactory.createModel('incompatibleSetModel');

        restoreCurrentTime = mockCurrentTime();
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    describe('Tests start after inserting some sets from local', (): void => {
      let setList: readonly Set[];

      beforeEach(
        async (): Promise<void> => {
          setList = Array(4)
            .fill(null)
            .map(
              (_, index): Set => {
                return new SetBuilder().build({
                  setName: 'setName' + index,
                  learningLanguageCode: 'en',
                  translatedToLanguageCode: 'en',
                  extraData: [
                    {
                      dataName:
                        SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
                      dataValue: index,
                    },
                  ],
                });
              }
            );

          await userDb.transaction(
            (tx): void => {
              setModel.insertSets(tx, setList, 'local');
            }
          );

          jest.clearAllMocks();
        }
      );
    });

    describe('Tests start after inserting some sets from remote', (): void => {
      let setList: readonly Set[];

      beforeEach(
        async (): Promise<void> => {
          setList = Array(4)
            .fill(null)
            .map(
              (_, index): Set => {
                return new SetBuilder().build({
                  setName: 'setName' + index,
                  learningLanguageCode: 'en',
                  translatedToLanguageCode: 'en',
                  lastSyncedAt: moment()
                    .add(index, 'hours')
                    .toDate(),
                  extraData: [
                    {
                      dataName: SetExtraDataName.SPACED_REPETITION_MAX_LIMIT,
                      dataValue: 0,
                    },
                  ],
                });
              }
            );

          await userDb.transaction(
            (tx): void => {
              setModel.insertSets(tx, setList, 'remote');
            }
          );

          jest.clearAllMocks();
        }
      );

      test('upsert incompatible set', async (): Promise<void> => {
        const incompatibleSetIds = setList.map((set): string => set.setId);

        // Should update without any problems
        await userDb.transaction(
          (tx): void => {
            incompatibleSetModel.upsertIncompatibleSets(
              tx,
              incompatibleSetIds,
              '0001.0001.0001'
            );
          }
        );

        const {
          setIds,
        } = await incompatibleSetModel.getIncompatibleSetIdsForRedownload(
          userDb,
          '0001.0001.0002',
          10,
          true
        );

        expect(setIds).toIncludeSameMembers(incompatibleSetIds);
      });

      test('upser incompatible version should overwrite existing version', async (): Promise<
        void
      > => {
        const incompatibleSetIds = setList.map((set): string => set.setId);

        await userDb.transaction(
          (tx): void => {
            incompatibleSetModel.upsertIncompatibleSets(
              tx,
              incompatibleSetIds,
              '0002.0001.0001'
            );
          }
        );

        // Should update without any problems
        await userDb.transaction(
          (tx): void => {
            incompatibleSetModel.upsertIncompatibleSets(
              tx,
              incompatibleSetIds,
              '0001.0001.0001'
            );
          }
        );

        const {
          setIds,
        } = await incompatibleSetModel.getIncompatibleSetIdsForRedownload(
          userDb,
          '0001.0001.0002',
          10,
          true
        );

        expect(setIds).toIncludeSameMembers(incompatibleSetIds);
      });

      describe('Tests start aftering inserting incompatible sets', (): void => {
        let incompatibleSetIds: readonly string[];

        beforeEach(
          async (): Promise<void> => {
            incompatibleSetIds = setList.map((set): string => set.setId);

            await userDb.transaction(
              (tx): void => {
                incompatibleSetModel.upsertIncompatibleSets(
                  tx,
                  incompatibleSetIds,
                  '0001.0002.0003'
                );
              }
            );
          }
        );

        test('delete incompatible sets', async (): Promise<void> => {
          await userDb.transaction(
            (tx): void => {
              incompatibleSetModel.deleteIncompatibleSets(
                tx,
                incompatibleSetIds
              );
            }
          );

          const {
            setIds,
          } = await incompatibleSetModel.getIncompatibleSetIdsForRedownload(
            userDb,
            '0001.0002.0004',
            10,
            true
          );

          expect(setIds).toIncludeSameMembers([]);
        });

        test('should return incompatible set ids if current version is higher', async (): Promise<
          void
        > => {
          const {
            setIds,
          } = await incompatibleSetModel.getIncompatibleSetIdsForRedownload(
            userDb,
            '0001.0002.0004',
            10,
            true
          );

          expect(setIds).toIncludeSameMembers(incompatibleSetIds.slice());
        });

        test('should not return incompatible set ids if current version is equal to the last tried version', async (): Promise<
          void
        > => {
          const {
            setIds,
          } = await incompatibleSetModel.getIncompatibleSetIdsForRedownload(
            userDb,
            '0001.0002.0003',
            10,
            true
          );

          expect(setIds).toIncludeSameMembers([]);
        });

        test('should not return incompatible set ids if current version is lower', async (): Promise<
          void
        > => {
          const {
            setIds,
          } = await incompatibleSetModel.getIncompatibleSetIdsForRedownload(
            userDb,
            '0001.0002.0002',
            10,
            true
          );

          expect(setIds).toIncludeSameMembers([]);
        });
      });
    });
  });
});
