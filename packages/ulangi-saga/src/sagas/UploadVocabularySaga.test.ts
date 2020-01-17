/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  DefinitionBuilder,
  VocabularyBuilder,
} from '@ulangi/ulangi-common/builders';
import {
  UploadVocabularyRequest,
  Vocabulary,
} from '@ulangi/ulangi-common/interfaces';
import { mockTransaction } from '@ulangi/ulangi-common/testing-utils';
import {
  DirtyVocabularyModel,
  SessionModel,
} from '@ulangi/ulangi-local-database';
import axios from 'axios';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { createRequest } from '../utils/createRequest';
import { UploadVocabularySaga } from './UploadVocabularySaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  SessionModel: SessionModelMock,
  DirtyVocabularyModel: DirtyVocabularyModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('UploadVocabularySaga', (): void => {
  const apiUrl = 'http://localhost:8082';
  const uploadLimit = 10;

  describe('Tests start with all mocked modules', (): void => {
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSessionModel: jest.Mocked<SessionModel>;
    let mockedDirtyVocabularyModel: jest.Mocked<DirtyVocabularyModel>;
    let uploadVocabularySaga: UploadVocabularySaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);

        mockedSessionModel = new SessionModelMock();
        mockedDirtyVocabularyModel = new DirtyVocabularyModelMock();

        uploadVocabularySaga = new UploadVocabularySaga(
          mockedUserDatabase,
          mockedSharedDatabase,
          mockedSessionModel,
          mockedDirtyVocabularyModel
        );
      }
    );

    describe('Test uploadVocabulary', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(
            uploadVocabularySaga.uploadVocabulary.bind(uploadVocabularySaga),
            apiUrl,
            uploadLimit
          );
        }
      );

      test('upload vocabulary success flow', async (): Promise<void> => {
        const setId = 'setId';
        const vocabularyList = Array(4)
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
                writing: {
                  level: index,
                },
              });
            }
          );
        const vocabularyIdSetIdPairs = vocabularyList.map(
          (vocabulary): [string, string] => {
            return [vocabulary.vocabularyId, setId];
          }
        );
        const markVocabularyListAsSynced = jest.fn();

        const accessToken = 'accessToken';
        const response = {
          data: {
            acknowledged: vocabularyList.map(
              (vocabulary): string => vocabulary.vocabularyId
            ),
          },
        };

        const stripUnknown = true;

        await saga
          .provide([
            [
              matchers.call.fn(
                mockedDirtyVocabularyModel.getDirtyVocabularyListForSyncing
              ),
              {
                vocabularyList,
                vocabularyIdSetIdPairs,
                markVocabularyListAsSynced,
              },
            ],
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [matchers.call.fn(axios.request), response],
          ])
          .call(
            [mockedDirtyVocabularyModel, 'getDirtyVocabularyListForSyncing'],
            mockedUserDatabase,
            uploadLimit,
            stripUnknown
          )
          .put(
            createAction(ActionType.VOCABULARY__UPLOADING_VOCABULARY, {
              vocabularyList,
            })
          )
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
            [axios, 'request'],
            createRequest<UploadVocabularyRequest>(
              'post',
              apiUrl,
              '/upload-vocabulary',
              null,
              {
                vocabularyList,
                vocabularySetIdPairs: vocabularyIdSetIdPairs,
              },
              { accessToken }
            )
          )
          .put(
            createAction(ActionType.VOCABULARY__UPLOAD_VOCABULARY_SUCCEEDED, {
              noMore: false,
            })
          )
          .returns({ success: true, noMore: false })
          .run();

        expect(markVocabularyListAsSynced).toHaveBeenCalledWith(
          mockedTransaction,
          response.data.acknowledged
        );
      });
    });
  });
});
