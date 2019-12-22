/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder } from '@ulangi/ulangi-common/builders';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { FieldState } from '../enums/FieldState';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtySetFieldRow } from '../interfaces/DirtySetFieldRow';
import { DirtySetModel } from './DirtySetModel';
import { SetModel } from './SetModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('DirtySetModel', (): void => {
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

      test('get dirty sets', async (): Promise<void> => {
        const {
          setList: fetchedSetList,
        } = await dirtySetModel.getDirtySetsForSyncing(userDb, 10, true);

        expect(fetchedSetList).toIncludeSameMembers(setList.slice());
      });

      test('mark records as synced', async (): Promise<void> => {
        const { markSetsAsSynced } = await dirtySetModel.getDirtySetsForSyncing(
          userDb,
          10,
          true
        );

        const syncedSetIds = setList
          .filter((_, index): boolean => index % 2 === 0)
          .map((set): string => set.setId);

        await userDb.transaction(
          (tx): void => {
            markSetsAsSynced(tx, syncedSetIds);
          }
        );

        const {
          setList: dirtySetList,
        } = await dirtySetModel.getDirtySetsForSyncing(userDb, 10, true);

        expect(dirtySetList).toIncludeSameMembers(
          setList.filter((_, index): boolean => index % 2 !== 0)
        );
      });

      test('get dirty sets should only return dirty fields', async (): Promise<
        void
      > => {
        // Unmark setName as dirty
        await userDb.transaction(
          (tx): void => {
            dirtySetModel.deleteDirtyFields(
              tx,
              setList.map(
                (set): Pick<DirtySetFieldRow, 'setId' | 'fieldName'> => {
                  return {
                    setId: set.setId,
                    fieldName: 'setName',
                  };
                }
              ),
              { withState: FieldState.TO_BE_SYNCED }
            );
          }
        );

        const {
          setList: fetchedSetList,
        } = await dirtySetModel.getDirtySetsForSyncing(userDb, 10, true);
        expect(fetchedSetList).toIncludeSameMembers(
          setList.map(
            (set): DeepPartial<Set> => {
              // Should not contain setName since it's no longer dirty
              return _.omit(set, 'setName');
            }
          )
        );
      });

      test('delete dirty fields', async (): Promise<void> => {
        await userDb.transaction(
          (tx): void => {
            dirtySetModel.deleteDirtyFields(
              tx,
              setList.map(
                (set): Pick<DirtySetFieldRow, 'setId' | 'fieldName'> => {
                  return {
                    setId: set.setId,
                    fieldName: 'setName',
                  };
                }
              ),
              { withState: FieldState.TO_BE_SYNCED }
            );
          }
        );

        const {
          setList: fetchedSetList,
        } = await dirtySetModel.getDirtySetsForSyncing(userDb, 10, true);
        expect(fetchedSetList).toIncludeSameMembers(
          setList.map(
            (set): DeepPartial<Set> => {
              // Should not contain setName since it's no longer dirty
              return _.omit(set, 'setName');
            }
          )
        );
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
              setModel.insertSets(tx, setList, 'remote');
            }
          );

          jest.clearAllMocks();
        }
      );
    });
  });
});
