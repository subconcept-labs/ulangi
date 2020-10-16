/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { Feedback, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import { VocabularyModel, WritingModel } from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';

import { WritingSaga } from './WritingSaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  VocabularyModel: VocabularyModelMock,
  WritingModel: WritingModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('WritingSaga', (): void => {
  describe('Test starts with all mocked modules', (): void => {
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedVocabularyModel: jest.Mocked<VocabularyModel>;
    let mockedWritingModel: jest.Mocked<WritingModel>;
    let writingSaga: WritingSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);

        mockedVocabularyModel = new VocabularyModelMock();
        mockedWritingModel = new WritingModelMock();

        writingSaga = new WritingSaga(
          mockedUserDatabase,
          mockedVocabularyModel,
          mockedWritingModel
        );
      }
    );

    describe('Test allowSaveResult with maxLevel = 10', (): void => {
      let vocabularyList: Vocabulary[];
      const maxLevel = 10;

      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          saga = expectSaga(
            writingSaga.allowSaveResult.bind(writingSaga),
            maxLevel
          );
          vocabularyList = Array(5)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({
                  writing: {
                    level: 5,
                  },
                });
              }
            );

          restoreCurrentTime = mockCurrentTime();
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('update levels correctly based on feedback', async (): Promise<
        void
      > => {
        const feedbackList = new Map(
          _.values(Feedback).map(
            (feedback, index): [string, Feedback] => {
              return [vocabularyList[index].vocabularyId, feedback as Feedback];
            }
          )
        );

        await saga
          .dispatch(
            createAction(ActionType.WRITING__SAVE_RESULT, {
              vocabularyList: new Map(
                vocabularyList.map(
                  (vocabulary): [string, Vocabulary] => [
                    vocabulary.vocabularyId,
                    vocabulary,
                  ]
                )
              ),
              feedbackList,
              autoArchiveSettings: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 0,
                writingLevelThreshold: 10,
              },
            })
          )
          .put(createAction(ActionType.WRITING__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(createAction(ActionType.WRITING__SAVE_RESULT_SUCCEEDED, null))
          .silentRun();

        const expectedResults = [
          { vocabularyId: vocabularyList[0].vocabularyId, level: 1 },
          { vocabularyId: vocabularyList[1].vocabularyId, level: 3 },
          { vocabularyId: vocabularyList[2].vocabularyId, level: 6 },
          { vocabularyId: vocabularyList[3].vocabularyId, level: 7 },
          { vocabularyId: vocabularyList[4].vocabularyId, level: 8 },
        ];

        expect(
          mockedVocabularyModel.updateMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          expectedResults.map(
            (result): [DeepPartial<Vocabulary>, undefined] => {
              return [
                {
                  vocabularyId: result.vocabularyId,
                  writing: {
                    lastWrittenAt: moment().toDate(),
                    level: result.level,
                  },
                },
                undefined,
              ];
            }
          ),
          'local'
        );
      });

      test('archive vocabulary based on vocabulary level', async (): Promise<
        void
      > => {
        const feedbackList = new Map(
          _.values(Feedback).map(
            (feedback, index): [string, Feedback] => {
              return [vocabularyList[index].vocabularyId, feedback as Feedback];
            }
          )
        );

        await saga
          .dispatch(
            createAction(ActionType.WRITING__SAVE_RESULT, {
              vocabularyList: new Map(
                vocabularyList.map(
                  (vocabulary): [string, Vocabulary] => [
                    vocabulary.vocabularyId,
                    vocabulary,
                  ]
                )
              ),
              feedbackList,
              autoArchiveSettings: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 0,
                writingLevelThreshold: 6,
              },
            })
          )
          .put(createAction(ActionType.WRITING__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(createAction(ActionType.WRITING__SAVE_RESULT_SUCCEEDED, null))
          .silentRun();

        const expectedResults = [
          { vocabularyId: vocabularyList[0].vocabularyId, level: 1 },
          { vocabularyId: vocabularyList[1].vocabularyId, level: 3 },
          {
            vocabularyId: vocabularyList[2].vocabularyId,
            level: 6,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
          },
          {
            vocabularyId: vocabularyList[3].vocabularyId,
            level: 7,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
          },
          {
            vocabularyId: vocabularyList[4].vocabularyId,
            level: 8,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
          },
        ];

        expect(
          mockedVocabularyModel.updateMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          expectedResults.map(
            (result): [DeepPartial<Vocabulary>, undefined] => {
              return [
                {
                  vocabularyId: result.vocabularyId,
                  vocabularyStatus: result.vocabularyStatus,
                  writing: {
                    lastWrittenAt: moment().toDate(),
                    level: result.level,
                  },
                },
                undefined,
              ];
            }
          ),
          'local'
        );
      });
    });
  });
});
