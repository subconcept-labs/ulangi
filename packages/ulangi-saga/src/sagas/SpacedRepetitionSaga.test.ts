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
import {
  SpacedRepetitionModel,
  VocabularyModel,
} from '@ulangi/ulangi-local-database';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';

import { SpacedRepetitionSaga } from './SpacedRepetitionSaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  VocabularyModel: VocabularyModelMock,
  SpacedRepetitionModel: SpacedRepetitionModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('SpacedRepetitionSaga', (): void => {
  describe('Test starts with all mocked modules', (): void => {
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedVocabularyModel: jest.Mocked<VocabularyModel>;
    let mockedSpacedRepetitionModel: jest.Mocked<SpacedRepetitionModel>;
    let spacedRepetitionSaga: SpacedRepetitionSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);

        mockedVocabularyModel = new VocabularyModelMock();
        mockedSpacedRepetitionModel = new SpacedRepetitionModelMock();

        spacedRepetitionSaga = new SpacedRepetitionSaga(
          mockedUserDatabase,
          mockedVocabularyModel,
          mockedSpacedRepetitionModel
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
            spacedRepetitionSaga.allowSaveResult.bind(spacedRepetitionSaga),
            maxLevel
          );
          vocabularyList = Array(5)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({ level: 5 });
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
        const feedbackList = new Map([
          [vocabularyList[0].vocabularyId, Feedback.POOR],
          [vocabularyList[1].vocabularyId, Feedback.FAIR],
          [vocabularyList[2].vocabularyId, Feedback.GOOD],
          [vocabularyList[3].vocabularyId, Feedback.GREAT],
          [vocabularyList[4].vocabularyId, Feedback.SUPERB],
        ]);

        await saga
          .dispatch(
            createAction(ActionType.SPACED_REPETITION__SAVE_RESULT, {
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
                spacedRepetitionLevelThreshold: 10,
                writingLevelThreshold: 0,
              },
            })
          )
          .put(createAction(ActionType.SPACED_REPETITION__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(
              ActionType.SPACED_REPETITION__SAVE_RESULT_SUCCEEDED,
              null
            )
          )
          .silentRun();

        const lastLearnedAt = moment().toDate();
        const expectedResults = [
          {
            vocabularyId: vocabularyList[0].vocabularyId,
            lastLearnedAt,
            level: 1,
          },
          {
            vocabularyId: vocabularyList[1].vocabularyId,
            lastLearnedAt,
            level: 3,
          },
          {
            vocabularyId: vocabularyList[2].vocabularyId,
            lastLearnedAt,
            level: 6,
          },
          {
            vocabularyId: vocabularyList[3].vocabularyId,
            lastLearnedAt,
            level: 7,
          },
          {
            vocabularyId: vocabularyList[4].vocabularyId,
            lastLearnedAt,
            level: 8,
          },
        ];
        expect(
          mockedVocabularyModel.updateMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          expectedResults.map(
            (vocabulary): [DeepPartial<Vocabulary>, undefined] => [
              vocabulary,
              undefined,
            ]
          ),
          'local'
        );
      });

      test('archive vocabulary based on vocabulary level', async (): Promise<
        void
      > => {
        const feedbackList = new Map([
          [vocabularyList[0].vocabularyId, Feedback.POOR],
          [vocabularyList[1].vocabularyId, Feedback.FAIR],
          [vocabularyList[2].vocabularyId, Feedback.GOOD],
          [vocabularyList[3].vocabularyId, Feedback.GREAT],
          [vocabularyList[4].vocabularyId, Feedback.SUPERB],
        ]);

        await saga
          .dispatch(
            createAction(ActionType.SPACED_REPETITION__SAVE_RESULT, {
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
                spacedRepetitionLevelThreshold: 6,
                writingLevelThreshold: 0,
              },
            })
          )
          .put(createAction(ActionType.SPACED_REPETITION__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(
              ActionType.SPACED_REPETITION__SAVE_RESULT_SUCCEEDED,
              null
            )
          )
          .silentRun();

        const lastLearnedAt = moment().toDate();
        const expectedResults = [
          {
            vocabularyId: vocabularyList[0].vocabularyId,
            lastLearnedAt,
            level: 1,
          },
          {
            vocabularyId: vocabularyList[1].vocabularyId,
            lastLearnedAt,
            level: 3,
          },
          {
            vocabularyId: vocabularyList[2].vocabularyId,
            lastLearnedAt,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
            level: 6,
          },
          {
            vocabularyId: vocabularyList[3].vocabularyId,
            lastLearnedAt,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
            level: 7,
          },
          {
            vocabularyId: vocabularyList[4].vocabularyId,
            lastLearnedAt,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
            level: 8,
          },
        ];
        expect(
          mockedVocabularyModel.updateMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          expectedResults.map(
            (vocabulary): [DeepPartial<Vocabulary>, undefined] => [
              vocabulary,
              undefined,
            ]
          ),
          'local'
        );
      });
    });
  });
});
