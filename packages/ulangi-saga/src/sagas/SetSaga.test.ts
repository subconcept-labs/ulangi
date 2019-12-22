/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { SetBuilder } from '@ulangi/ulangi-common/builders';
import { SetExtraDataName, SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import { SetModel } from '@ulangi/ulangi-local-database';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SetSaga } from './SetSaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const { SetModel: SetModelMock } = jest.genMockFromModule(
  '@ulangi/ulangi-local-database'
);

describe('SetSaga', (): void => {
  describe('Tests start with all mocked modules', (): void => {
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedSetModel: jest.Mocked<SetModel>;
    let setSaga: SetSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);
        mockedSetModel = new SetModelMock();

        setSaga = new SetSaga(
          mockedUserDatabase,
          mockedSetModel,
          new CrashlyticsAdapter(null, false)
        );
      }
    );

    describe('Test allowAdd', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          saga = expectSaga(setSaga.allowAdd.bind(setSaga));
          restoreCurrentTime = mockCurrentTime();
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('add set success flow', async (): Promise<void> => {
        const set = new SetBuilder().build({
          setName: 'setName',
          learningLanguageCode: 'en',
          translatedToLanguageCode: 'vi',
          extraData: [
            {
              dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
              dataValue: 12,
            },
          ],
        });

        await saga
          .dispatch(createAction(ActionType.SET__ADD, { set }))
          .put(createAction(ActionType.SET__ADDING, { set }))
          .call.fn(mockedUserDatabase.transaction)
          .put(createAction(ActionType.SET__ADD_SUCCEEDED, { set }))
          .silentRun();

        expect(mockedSetModel.insertSet).toHaveBeenCalledWith(
          mockedTransaction,
          set,
          'local'
        );
      });
    });

    describe('Test allowEdit', (): void => {
      let restoreCurrentTime: () => void;

      beforeEach(
        (): void => {
          saga = expectSaga(setSaga.allowEdit.bind(setSaga));
          restoreCurrentTime = mockCurrentTime();
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('edit set success flow', async (): Promise<void> => {
        const editedSet: DeepPartial<Set> = {
          setId: 'setId',
          setName: 'editedSetName',
          extraData: [
            {
              dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
              dataValue: 10,
            },
          ],
        };
        const updatedSet = new SetBuilder().build(editedSet);

        await saga
          .provide([
            [matchers.call.fn(mockedSetModel.getSetById), { set: updatedSet }],
          ])
          .dispatch(createAction(ActionType.SET__EDIT, { set: editedSet }))
          .put(createAction(ActionType.SET__EDITING, { set: editedSet }))
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(ActionType.SET__EDIT_SUCCEEDED, { set: updatedSet })
          )
          .call(
            [mockedSetModel, 'getSetById'],
            mockedUserDatabase,
            editedSet.setId,
            false
          )
          .silentRun();

        expect(mockedSetModel.updateSet).toHaveBeenCalledWith(
          mockedTransaction,
          editedSet,
          'local'
        );
      });
    });

    describe('Test allowFetchAll', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(setSaga.allowFetchAll.bind(setSaga));
        }
      );

      test('fetch all sets success flow', async (): Promise<void> => {
        const setList = Array(4)
          .fill(null)
          .map(
            (_, index): Set => {
              return new SetBuilder().build({
                setName: 'setName' + index,
                learningLanguageCode: 'en',
                translatedToLanguageCode: 'vi',
                extraData: [
                  {
                    dataName:
                      SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
                    dataValue: 12,
                  },
                ],
              });
            }
          );

        await saga
          .provide([[matchers.call.fn(mockedSetModel.getAllSets), { setList }]])
          .dispatch(createAction(ActionType.SET__FETCH_ALL, null))
          .put(createAction(ActionType.SET__FETCHING_ALL, null))
          .call([mockedSetModel, 'getAllSets'], mockedUserDatabase, true)
          .put(createAction(ActionType.SET__FETCH_ALL_SUCCEEDED, { setList }))
          .silentRun();
      });
    });

    describe('Test allowFetch', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(setSaga.allowFetch.bind(setSaga));
        }
      );

      test('fetch sets success flow', async (): Promise<void> => {
        const setStatus = SetStatus.ACTIVE;
        const setList = Array(4)
          .fill(null)
          .map(
            (_, index): Set => {
              return new SetBuilder().build({
                setName: 'setName' + index,
                learningLanguageCode: 'en',
                translatedToLanguageCode: 'vi',
                extraData: [
                  {
                    dataName:
                      SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
                    dataValue: 12,
                  },
                ],
              });
            }
          );

        await saga
          .provide([
            [matchers.call.fn(mockedSetModel.getSetsByStatus), { setList }],
          ])
          .dispatch(createAction(ActionType.SET__FETCH, { setStatus }))
          .put(
            createAction(ActionType.SET__FETCHING, {
              setStatus: SetStatus.ACTIVE,
            })
          )
          .call(
            [mockedSetModel, 'getSetsByStatus'],
            mockedUserDatabase,
            SetStatus.ACTIVE,
            true
          )
          .put(
            createAction(ActionType.SET__FETCH_SUCCEEDED, {
              setList,
              setStatus: SetStatus.ACTIVE,
            })
          )
          .silentRun();
      });
    });
  });
});
