/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { currentComparableCommonVersion } from '@ulangi/ulangi-common';
import {
  DefinitionBuilder,
  VocabularyBuilder,
} from '@ulangi/ulangi-common/builders';
import {
  DownloadVocabularyRequest,
  Vocabulary,
} from '@ulangi/ulangi-common/interfaces';
import { VocabularyResolver } from '@ulangi/ulangi-common/resolvers';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import {
  IncompatibleVocabularyModel,
  SessionModel,
  VocabularyModel,
} from '@ulangi/ulangi-local-database';
import axios from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { createRequest } from '../utils/createRequest';
import { DownloadVocabularySaga } from './DownloadVocabularySaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  SessionModel: SessionModelMock,
  VocabularyModel: VocabularyModelMock,
  IncompatibleVocabularyModel: IncompatibleVocabularyModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('DownloadVocabularySaga', (): void => {
  const apiUrl = 'http://localhost:8082';
  const downloadLimit = 20;
  const transactionChunkSize = 4;
  const delayBetweenChunks = 500;

  describe('Tests start with all mocked modules', (): void => {
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSessionModel: jest.Mocked<SessionModel>;
    let mockedVocabularyModel: jest.Mocked<VocabularyModel>;
    let mockedIncompatibleVocabularyModel: jest.Mocked<
      IncompatibleVocabularyModel
    >;
    let syncVocabularySaga: DownloadVocabularySaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);

        mockedSessionModel = new SessionModelMock();
        mockedVocabularyModel = new VocabularyModelMock();
        mockedIncompatibleVocabularyModel = new IncompatibleVocabularyModelMock();

        syncVocabularySaga = new DownloadVocabularySaga(
          mockedUserDatabase,
          mockedSharedDatabase,
          mockedSessionModel,
          mockedVocabularyModel,
          mockedIncompatibleVocabularyModel,
          new CrashlyticsAdapter(null, false)
        );
      }
    );

    describe('Test downloadVocabulary', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            syncVocabularySaga.downloadVocabulary.bind(syncVocabularySaga),
            apiUrl,
            downloadLimit,
            transactionChunkSize,
            delayBetweenChunks
          );
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('download vocabulary success flow', async (): Promise<void> => {
        const latestSyncedTime = moment().toDate();
        const accessToken = 'accessToken';
        const setId = 'setId';
        const incompatibleVocabularyList = Array(4)
          .fill(null)
          .map(
            (_, index): Vocabulary => {
              return new VocabularyBuilder().build({
                vocabularyText: 'incompatible vocabulary' + index,
                unknownProps: 'unknownProps',
              } as any);
            }
          );
        const compatibleVocabularyList = Array(4)
          .fill(null)
          .map(
            (_, index): Vocabulary => {
              return new VocabularyBuilder().build({
                vocabularyText: 'vocabulary' + index,
                definitions: [
                  new DefinitionBuilder().build({
                    meaning: 'meaning' + index,
                    source: 'source' + index,
                  }),
                ],
                category: {
                  categoryName: 'categoryName' + index,
                },
              });
            }
          );

        const unresolvedVocabularyList = [
          ...incompatibleVocabularyList,
          ...compatibleVocabularyList,
        ];

        const resolvedVocabularyList = new VocabularyResolver().resolveArray(
          unresolvedVocabularyList,
          true
        );

        const toBeInsertedVocabularyList = _.sortBy(
          resolvedVocabularyList,
          'lastSyncedAt'
        );
        const chunks = _.chunk(
          toBeInsertedVocabularyList,
          transactionChunkSize
        );

        const vocabularySetIdPairs = toBeInsertedVocabularyList.map(
          (vocabulary): [string, string] => {
            return [vocabulary.vocabularyId, setId];
          }
        );
        const vocabularySetIdMap = _.fromPairs(vocabularySetIdPairs);
        const response = {
          data: {
            vocabularyList: unresolvedVocabularyList,
            vocabularySetIdPairs,
            noMore: false,
          },
        };

        const existingVocabularyIds = toBeInsertedVocabularyList
          .filter((_, index): boolean => index % 2 === 0)
          .map((vocabulary): string => vocabulary.vocabularyId);

        saga
          .provide([
            [
              matchers.call.fn(mockedVocabularyModel.getLatestSyncTime),
              latestSyncedTime,
            ],
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [matchers.call.fn(axios.request), response],
            [
              matchers.call.fn(mockedVocabularyModel.vocabularyIdsExist),
              existingVocabularyIds,
            ],
          ])
          .call(
            [mockedVocabularyModel, 'getLatestSyncTime'],
            mockedUserDatabase
          )
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
            [axios, 'request'],
            createRequest<DownloadVocabularyRequest>(
              'get',
              apiUrl,
              '/download-vocabulary',
              {
                startAt: latestSyncedTime,
                softLimit: downloadLimit,
              },
              null,
              { accessToken }
            )
          )
          .put(
            createAction(ActionType.VOCABULARY__DOWNLOADING_VOCABULARY, {
              startAt: latestSyncedTime,
            })
          )
          .call(
            [mockedVocabularyModel, 'vocabularyIdsExist'],
            mockedUserDatabase,
            toBeInsertedVocabularyList.map(
              (vocabulary): string => vocabulary.vocabularyId
            )
          );

        chunks.forEach(
          (): void => {
            saga.call.fn(mockedUserDatabase.transaction);
          }
        );

        await saga
          .put(
            createAction(ActionType.VOCABULARY__DOWNLOAD_VOCABULARY_SUCCEEDED, {
              vocabularyList: toBeInsertedVocabularyList,
              noMore: false,
            })
          )
          .returns({ success: true, noMore: false })
          .run(10000);

        chunks.forEach(
          (chunk, index): void => {
            expect(
              mockedVocabularyModel.insertMultipleVocabulary
            ).toHaveBeenNthCalledWith(
              index + 1,
              mockedTransaction,
              chunk
                .filter(
                  (vocabulary): boolean =>
                    !_.includes(existingVocabularyIds, vocabulary.vocabularyId)
                )
                .map(
                  (vocabulary): [Vocabulary, string] => [
                    vocabulary,
                    vocabularySetIdMap[vocabulary.vocabularyId],
                  ]
                ),
              'remote'
            );

            expect(
              mockedVocabularyModel.updateMultipleVocabulary
            ).toHaveBeenNthCalledWith(
              index + 1,
              mockedTransaction,
              chunk
                .filter(
                  (vocabulary): boolean =>
                    _.includes(existingVocabularyIds, vocabulary.vocabularyId)
                )
                .map(
                  (vocabulary): [Vocabulary, string] => [
                    vocabulary,
                    vocabularySetIdMap[vocabulary.vocabularyId],
                  ]
                ),
              'remote'
            );

            expect(
              mockedIncompatibleVocabularyModel.upsertMultipleIncompatibleVocabulary
            ).toHaveBeenNthCalledWith(
              index + 1,
              mockedTransaction,
              incompatibleVocabularyList
                .filter(
                  (vocabulary): boolean =>
                    _.includes(
                      chunk.map(
                        (vocabulary): string => vocabulary.vocabularyId
                      ),
                      vocabulary.vocabularyId
                    )
                )
                .map((vocabulary): string => vocabulary.vocabularyId),
              currentComparableCommonVersion
            );
          }
        );
      });
    });
  });
});
