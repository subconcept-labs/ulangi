/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder } from '@ulangi/ulangi-common/builders';
import { SetExtraDataName, SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEvent } from '../enums/DatabaseEvent';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtySetModel } from './DirtySetModel';
import { SetModel } from './SetModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('SetModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let mockedDatabaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let dirtySetModel: DirtySetModel;
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
        dirtySetModel = modelFactory.createModel('dirtySetModel');

        restoreCurrentTime = mockCurrentTime();
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    test('local insert sets into database successfully', async (): Promise<
      void
    > => {
      const setList = Array(4)
        .fill(null)
        .map(
          (_, index): Set => {
            return new SetBuilder().build({
              setName: 'setName' + index,
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

      const { setList: fetchedSetList } = await setModel.getAllSets(
        userDb,
        true
      );

      expect(fetchedSetList).toIncludeSameMembers(setList);
      expect(mockedDatabaseEventBus.publish).toHaveBeenCalledWith(
        DatabaseEvent.SET_INSERTED_FROM_LOCAL
      );
      expect(mockedDatabaseEventBus.publish).toHaveBeenCalledTimes(1);
    });

    test('local insert set failed because setName is empty', async (): Promise<
      void
    > => {
      const set = new SetBuilder().build({
        setName: '',
        learningLanguageCode: 'en',
        translatedToLanguageCode: 'en',
      });

      await expect(
        userDb.transaction(
          (tx): void => {
            setModel.insertSet(tx, set, 'local');
          }
        )
      ).rejects.toMatchObject({
        details: [{ path: ['setName'], type: 'any.empty' }],
      });

      const { setList: fetchedSetList } = await setModel.getAllSets(
        userDb,
        true
      );

      expect(fetchedSetList).toIncludeSameMembers([]);
    });
    test('local insert sets failed because setName is empty', async (): Promise<
      void
    > => {
      const setList = Array(4)
        .fill(null)
        .map(
          (): Set => {
            return new SetBuilder().build({
              setName: '',
              learningLanguageCode: 'en',
              translatedToLanguageCode: 'en',
            });
          }
        );

      await expect(
        userDb.transaction(
          (tx): void => {
            setModel.insertSets(tx, setList, 'local');
          }
        )
      ).rejects.toMatchObject({
        details: [{ path: ['setName'], type: 'any.empty' }],
      });

      const { setList: fetchedSetList } = await setModel.getAllSets(
        userDb,
        true
      );

      expect(fetchedSetList).toIncludeSameMembers([]);
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

      test('get set by id', async (): Promise<void> => {
        for (const set of setList) {
          const { set: fetchedSet } = assertExists(
            await setModel.getSetById(userDb, set.setId, true)
          );

          expect(fetchedSet).toEqual(set);
        }
      });

      test('get all sets', async (): Promise<void> => {
        const { setList: fetchedSetList } = await setModel.getAllSets(
          userDb,
          true
        );

        expect(fetchedSetList).toIncludeSameMembers(
          setList.map((set): Set => set)
        );
      });

      test('get sets by status', async (): Promise<void> => {
        const { setList: fetchedSetList } = await setModel.getSetsByStatus(
          userDb,
          SetStatus.ACTIVE,
          true
        );

        expect(fetchedSetList).toIncludeSameMembers(
          setList
            .filter((set): boolean => set.setStatus === SetStatus.ACTIVE)
            .map((set): Set => set)
        );
      });

      test('set ids exist', async (): Promise<void> => {
        const existingSetIds = await setModel.setIdsExist(
          userDb,
          setList.map((set): string => set.setId)
        );
        expect(existingSetIds).toIncludeSameMembers(
          setList.map((set): string => set.setId)
        );
      });

      test('local update should overwrite records', async (): Promise<void> => {
        const editedSetList = setList.map(
          (set): DeepPartial<Set> => {
            return {
              setId: set.setId,
              setName: 'edited ' + set.setName,
            };
          }
        );

        await userDb.transaction(
          (tx): void => {
            setModel.updateSets(tx, editedSetList, 'local');
          }
        );

        const { setList: fetchedSetList } = await setModel.getAllSets(
          userDb,
          true
        );

        expect(fetchedSetList).toIncludeSameMembers(
          setList.map(
            (set): Set => {
              return {
                ...set,
                setName: 'edited ' + set.setName,
                updatedAt: moment().toDate(),
              };
            }
          )
        );
      });

      test('local update should mark records as dirty', async (): Promise<
        void
      > => {
        const {
          setList: dirtySetList,
        } = await dirtySetModel.getDirtySetsForSyncing(userDb, 10, true);

        expect(dirtySetList).toIncludeSameMembers(setList.slice());
      });

      test('remote update should not overwrite dirty records', async (): Promise<
        void
      > => {
        const editedSetList = setList.map(
          (set): DeepPartial<Set> => {
            return {
              setId: set.setId,
              setName: 'edited ' + set.setName,
            };
          }
        );

        await userDb.transaction(
          (tx): void => {
            setModel.updateSets(tx, editedSetList, 'remote');
          }
        );

        const { setList: fetchedSetList } = await setModel.getAllSets(
          userDb,
          true
        );

        expect(fetchedSetList).toIncludeSameMembers(setList.slice());
      });
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

      test('get lastest sync time', async (): Promise<void> => {
        const lastestSyncTime = await setModel.getLatestSyncTime(userDb);
        expect(lastestSyncTime).toEqual(
          assertExists(_.get(_.maxBy(setList, 'lastSyncedAt'), 'lastSyncedAt'))
        );
      });

      test('remote update should overwrite only clean records', async (): Promise<
        void
      > => {
        await userDb.transaction(
          (tx): void => {
            setModel.updateSets(
              tx,
              setList.map(
                (set): DeepPartial<Set> => {
                  return {
                    setId: set.setId,
                    setName: 'first edited ' + set.setName,
                  };
                }
              ),
              'local'
            );
          }
        );

        // This query should only update setStatus but not setName
        // because setName is dirty
        await userDb.transaction(
          (tx): void => {
            setModel.updateSets(
              tx,
              setList.map(
                (set): DeepPartial<Set> => {
                  return {
                    setId: set.setId,
                    setName: 'second edited ' + set.setName,
                    setStatus: SetStatus.DELETED,
                  };
                }
              ),
              'remote'
            );
          }
        );

        const { setList: fetchedSetList } = await setModel.getAllSets(
          userDb,
          true
        );

        expect(fetchedSetList).toIncludeSameMembers(
          setList.map(
            (set): Set => {
              return {
                ...set,
                setName: 'first edited ' + set.setName,
                setStatus: SetStatus.DELETED,
              };
            }
          )
        );
      });
    });
  });
});
