/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import {
  SetBuilder,
  SetExtraDataItemBuilder,
} from '@ulangi/ulangi-common/builders';
import { SetExtraDataName, SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtySetExtraDataModel } from './DirtySetExtraDataModel';
import { SetExtraDataModel } from './SetExtraDataModel';
import { SetModel } from './SetModel';

describe('SetExtraDataModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let databaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let setExtraDataModel: SetExtraDataModel;
    let dirtySetExtraDataModel: DirtySetExtraDataModel;
    let restoreCurrentTime: () => void;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(new SQLiteDatabaseAdapter(sqlite3));
        databaseEventBus = new DatabaseEventBus();
        await databaseFacade.connectUserDb((await tmp.file()).path);
        await databaseFacade.checkUserDb();
        userDb = databaseFacade.getDb('user');

        modelFactory = new ModelFactory(databaseEventBus);
        setModel = modelFactory.createModel('setModel');
        setExtraDataModel = modelFactory.createModel('setExtraDataModel');
        dirtySetExtraDataModel = modelFactory.createModel(
          'dirtySetExtraDataModel'
        );

        restoreCurrentTime = mockCurrentTime();
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    test('local upsert set extra data failed if setId does not exist (foreign key constraint)', async (): Promise<
      void
    > => {
      const setExtraDataItem: SetExtraDataItem = {
        dataName: SetExtraDataName.SPACED_REPEITTION_NEXT_TERM_POSITION,
        dataValue: 0,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
        firstSyncedAt: moment().toDate(),
        lastSyncedAt: moment().toDate(),
      };

      await expect(
        userDb.transaction(
          (tx): void => {
            setExtraDataModel.upsertExtraData(
              tx,
              setExtraDataItem,
              'unknownSetId',
              'local'
            );
          }
        )
      ).rejects.toThrow();
    });

    describe('Tests start after inserting some sets from local', (): void => {
      let setList: readonly Set[];
      beforeEach(
        async (): Promise<void> => {
          setList = Array(4)
            .fill(null)
            .map(
              (_, index): Set => {
                return new SetBuilder().build({
                  setId: 'setId' + index,
                  setStatus: SetStatus.ACTIVE,
                  setName: 'setName',
                  learningLanguageCode: 'en',
                  translatedToLanguageCode: 'en',
                });
              }
            );

          await userDb.transaction(
            (tx): void => {
              setModel.insertSets(tx, setList, 'local');
            }
          );
        }
      );

      test('local upsert extra data into database successfully', async (): Promise<
        void
      > => {
        const setExtraData: SetExtraDataItem = new SetExtraDataItemBuilder().build(
          {
            dataName: SetExtraDataName.SPACED_REPETITION_AUTO_ARCHIVE,
            dataValue: false,
          }
        );

        await userDb.transaction(
          (tx): void => {
            setExtraDataModel.upsertExtraData(
              tx,
              setExtraData,
              setList[0].setId,
              'local'
            );
          }
        );

        const {
          setExtraDataPerSetId,
        } = await setExtraDataModel.getExtraDataBySetIds(
          userDb,
          setList.map((set): string => set.setId),
          true
        );

        expect(setExtraDataPerSetId[setList[0].setId]).toIncludeSameMembers([
          setExtraData,
        ]);
      });

      test('local upsert multiple extra data database successfully', async (): Promise<
        void
      > => {
        const extraDataSetIdPairs = setList.map(
          (set, index): [SetExtraDataItem, string] => {
            return [
              new SetExtraDataItemBuilder().build({
                dataName: SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                dataValue: index,
              }),
              set.setId,
            ];
          }
        );

        await userDb.transaction(
          (tx): void => {
            setExtraDataModel.upsertMultipleExtraData(
              tx,
              extraDataSetIdPairs,
              'local'
            );
          }
        );

        const {
          setExtraDataPerSetId,
        } = await setExtraDataModel.getExtraDataBySetIds(
          userDb,
          setList.map((set): string => set.setId),
          true
        );

        _.forOwn(
          setExtraDataPerSetId,
          (setExtraData, setId): void => {
            expect(setExtraData).toIncludeSameMembers(
              extraDataSetIdPairs
                .filter((pair): boolean => setId === pair[1])
                .map(([setExtraDataItem]): SetExtraDataItem => setExtraDataItem)
            );
          }
        );
      });

      describe('Tests start after inserting some set extra data from local', (): void => {
        let extraDataSetIdPairs: readonly [SetExtraDataItem, string][];

        beforeEach(
          async (): Promise<void> => {
            extraDataSetIdPairs = setList.map(
              (set, index): [SetExtraDataItem, string] => {
                return [
                  new SetExtraDataItemBuilder().build({
                    dataName:
                      SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                    dataValue: index,
                  }),
                  set.setId,
                ];
              }
            );

            await userDb.transaction(
              (tx): void => {
                setExtraDataModel.upsertMultipleExtraData(
                  tx,
                  extraDataSetIdPairs,
                  'local'
                );
              }
            );
          }
        );

        test('get set extra data by set id', async (): Promise<void> => {
          const {
            setExtraData: fetchedSetExtraData,
          } = await setExtraDataModel.getExtraDataBySetId(
            userDb,
            setList[0].setId,
            true
          );

          expect(fetchedSetExtraData).toIncludeSameMembers(
            extraDataSetIdPairs
              .filter(([, setId]): boolean => setList[0].setId === setId)
              .map(([setExtraData]): SetExtraDataItem => setExtraData)
          );
        });

        test('get set extra data by set ids', async (): Promise<void> => {
          const {
            setExtraDataPerSetId,
          } = await setExtraDataModel.getExtraDataBySetIds(
            userDb,
            setList.map((set): string => set.setId),
            true
          );

          _.forOwn(
            setExtraDataPerSetId,
            (setExtraData, setId): void => {
              expect(setExtraData).toIncludeSameMembers(
                extraDataSetIdPairs
                  .filter((pair): boolean => pair[1] === setId)
                  .map(
                    ([setExtraDataItem]): SetExtraDataItem => setExtraDataItem
                  )
              );
            }
          );
        });

        test('local upsert extra data should mark records dirty', async (): Promise<
          void
        > => {
          const {
            setExtraDataPerSetId,
          } = await dirtySetExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            setList.map((set): string => set.setId),
            true
          );

          _.forOwn(
            setExtraDataPerSetId,
            (setExtraData, setId): void => {
              expect(setExtraData).toIncludeSameMembers(
                extraDataSetIdPairs
                  .filter(
                    (pair): boolean =>
                      pair[1] === setId &&
                      pair[0].dataName ===
                        SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD
                  )
                  .map(([setExtraData]): SetExtraDataItem => setExtraData)
              );
            }
          );
        });

        test('local upsert multiple extra data should overwrite existing rows', async (): Promise<
          void
        > => {
          const editedExtraDataSetIdPairs = setList.map(
            (set): [DeepPartial<SetExtraDataItem>, string] => {
              return [
                {
                  dataName: SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                  dataValue: 10,
                },
                set.setId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              setExtraDataModel.upsertMultipleExtraData(
                tx,
                editedExtraDataSetIdPairs,
                'local'
              );
            }
          );

          // Make sure the data is updated in the database
          const {
            setExtraDataPerSetId,
          } = await setExtraDataModel.getExtraDataBySetIds(
            userDb,
            setList.map((set): string => set.setId),
            true
          );

          _.forOwn(
            setExtraDataPerSetId,
            (setExtraData, setId): void => {
              expect(setExtraData).toIncludeSameMembers(
                extraDataSetIdPairs
                  .filter(
                    (pair): boolean =>
                      pair[1] === setId &&
                      pair[0].dataName ===
                        SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD
                  )
                  .map(
                    ([setExtraData]): SetExtraDataItem => {
                      return {
                        ...setExtraData,
                        dataName:
                          SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                        dataValue: 10,
                      };
                    }
                  )
              );
            }
          );
        });

        test('remote upsert extra data should not overwrite dirty records', async (): Promise<
          void
        > => {
          const editedExtraDataSetIdPairs = setList.map(
            (set): [DeepPartial<SetExtraDataItem>, string] => {
              return [
                {
                  dataName: SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                  dataValue: 10,
                  firstSyncedAt: moment().toDate(),
                  lastSyncedAt: moment().toDate(),
                },
                set.setId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              setExtraDataModel.upsertMultipleExtraData(
                tx,
                editedExtraDataSetIdPairs,
                'remote'
              );
            }
          );

          const {
            setExtraDataPerSetId,
          } = await setExtraDataModel.getExtraDataBySetIds(
            userDb,
            setList.map((set): string => set.setId),
            true
          );

          _.forOwn(
            setExtraDataPerSetId,
            (setExtraData, setId): void => {
              expect(setExtraData).toIncludeSameMembers(
                extraDataSetIdPairs
                  .filter(
                    (pair): boolean =>
                      pair[1] === setId &&
                      pair[0].dataName ===
                        SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD
                  )
                  .map(([setExtraData]): SetExtraDataItem => setExtraData)
              );
            }
          );
        });
      });

      describe('Tests start after inserting some set extra data from remote', (): void => {
        let extraDataSetIdPairs: readonly [SetExtraDataItem, string][];

        beforeEach(
          async (): Promise<void> => {
            extraDataSetIdPairs = setList.map(
              (set, index): [SetExtraDataItem, string] => {
                return [
                  new SetExtraDataItemBuilder().build({
                    dataName:
                      SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                    dataValue: index,
                  }),
                  set.setId,
                ];
              }
            );

            await userDb.transaction(
              (tx): void => {
                setExtraDataModel.upsertMultipleExtraData(
                  tx,
                  extraDataSetIdPairs,
                  'remote'
                );
              }
            );
          }
        );

        test('remote upsert extra data should not mark records as dirty', async (): Promise<
          void
        > => {
          const {
            setExtraDataPerSetId,
          } = await dirtySetExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            setList.map((set): string => set.setId),
            true
          );

          expect(setExtraDataPerSetId).toEqual({});
        });

        test('remote upsert extra data should overwrite only clean rows', async (): Promise<
          void
        > => {
          const editedExtraDataSetIdPairs = setList.map(
            (set): [DeepPartial<SetExtraDataItem>, string] => {
              return [
                {
                  dataName: SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                  dataValue: 10,
                },
                set.setId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              setExtraDataModel.upsertMultipleExtraData(
                tx,
                editedExtraDataSetIdPairs,
                'local'
              );
            }
          );

          const {
            setExtraDataPerSetId,
          } = await setExtraDataModel.getExtraDataBySetIds(
            userDb,
            setList.map((set): string => set.setId),
            true
          );

          _.forOwn(
            setExtraDataPerSetId,
            (setExtraData, setId): void => {
              expect(setExtraData).toIncludeSameMembers(
                extraDataSetIdPairs
                  .filter(
                    (pair): boolean =>
                      pair[1] === setId &&
                      pair[0].dataName ===
                        SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD
                  )
                  .map(
                    ([setExtraData]): SetExtraDataItem => {
                      return {
                        ...setExtraData,
                        dataName:
                          SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                        dataValue: 10,
                        updatedAt: moment().toDate(),
                      };
                    }
                  )
              );
            }
          );
        });
      });
    });
  });
});
