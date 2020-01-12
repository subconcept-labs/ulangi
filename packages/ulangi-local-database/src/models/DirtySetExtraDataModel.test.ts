/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

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
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { FieldState } from '../enums/FieldState';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtySetExtraDataModel } from './DirtySetExtraDataModel';
import { SetExtraDataModel } from './SetExtraDataModel';
import { SetModel } from './SetModel';

describe('DirtySetExtraDataModel', (): void => {
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

      describe('Tests start after inserting some set extra data from local', (): void => {
        let extraDataSetIdPairs: readonly [SetExtraDataItem, string][];

        beforeEach(
          async (): Promise<void> => {
            extraDataSetIdPairs = setList.map(
              (set, index): [SetExtraDataItem, string] => {
                return [
                  new SetExtraDataItemBuilder().build({
                    dataName: SetExtraDataName.SPACED_REPETITION_MAX_LIMIT,
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

        test('get dirty set extra data', async (): Promise<void> => {
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
                  .filter((pair): boolean => pair[1] === setId)
                  .map(([setExtraData]): SetExtraDataItem => setExtraData)
              );
            }
          );
        });

        test('mark records as synced', async (): Promise<void> => {
          const {
            markSetExtraDataAsSynced,
          } = await dirtySetExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            setList.map((set): string => set.setId),
            true
          );

          const syncedSetIds = setList
            .filter((_, index): boolean => index % 2 === 0)
            .map((set): string => set.setId);

          await userDb.transaction(
            (tx): void => {
              markSetExtraDataAsSynced(tx, syncedSetIds);
            }
          );

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
                    (pair, index): boolean =>
                      pair[1] === setId && index % 2 !== 0
                  )
                  .map(([setExtraData]): SetExtraDataItem => setExtraData)
              );
            }
          );
        });

        test('get dirty set extra data should return only dirty rows', async (): Promise<
          void
        > => {
          const syncedSetIds = setList
            .filter((_, index): boolean => index % 2 === 0)
            .map((set): string => set.setId);

          // Make some data synced
          await userDb.transaction(
            (tx): void => {
              dirtySetExtraDataModel.transitionFieldStates(tx, syncedSetIds, {
                toState: FieldState.SYNCED,
              });
            }
          );

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
                      pair[1] === setId && !_.includes(syncedSetIds, pair[1])
                  )
                  .map(([setExtraData]): SetExtraDataItem => setExtraData)
              );
            }
          );
        });

        test('transition to SYNCED', async (): Promise<void> => {
          // Make all data synced
          await userDb.transaction(
            (tx): void => {
              dirtySetExtraDataModel.transitionFieldStates(
                tx,
                setList.map((set): string => set.setId),
                { toState: FieldState.SYNCED }
              );
            }
          );

          const {
            setExtraDataPerSetId,
          } = await dirtySetExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            setList.map((set): string => set.setId),
            true
          );

          expect(setExtraDataPerSetId).toEqual({});
        });

        test('transition from TO_BE_SYNCED to SYNCING, then SYNCING to SYNCED', async (): Promise<
          void
        > => {
          await userDb.transaction(
            (tx): void => {
              dirtySetExtraDataModel.transitionFieldStates(
                tx,
                setList.map((set): string => set.setId),
                {
                  fromState: FieldState.TO_BE_SYNCED,
                  toState: FieldState.SYNCING,
                }
              );
            }
          );

          await userDb.transaction(
            (tx): void => {
              dirtySetExtraDataModel.transitionFieldStates(
                tx,
                setList.map((set): string => set.setId),
                {
                  fromState: FieldState.SYNCING,
                  toState: FieldState.SYNCED,
                }
              );
            }
          );

          const {
            setExtraDataPerSetId,
          } = await dirtySetExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            setList.map((set): string => set.setId),
            true
          );

          expect(setExtraDataPerSetId).toEqual({});
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
                    dataName: SetExtraDataName.SPACED_REPETITION_MAX_LIMIT,
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

        test('transition from all states except SYNCED to SYNCING', async (): Promise<
          void
        > => {
          await userDb.transaction(
            (tx): void => {
              dirtySetExtraDataModel.transitionFieldStates(
                tx,
                setList.map((set): string => set.setId),
                {
                  fromAllStatesExcept: FieldState.SYNCED,
                  toState: FieldState.SYNCING,
                }
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
                  .filter((pair): boolean => pair[1] === setId)
                  .map(([setExtraData]): SetExtraDataItem => setExtraData)
              );
            }
          );
        });
      });
    });
  });
});
