/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  SQLiteDatabase,
  SQLiteDatabaseAdapter,
  Transaction,
} from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { currentComparableCommonVersion } from '@ulangi/ulangi-common';
import {
  DefinitionBuilder,
  SetBuilder,
  VocabularyBuilder,
} from '@ulangi/ulangi-common/builders';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import {
  DownloadSpecificVocabularyRequest,
  Set,
  Vocabulary,
} from '@ulangi/ulangi-common/interfaces';
import { VocabularyResolver } from '@ulangi/ulangi-common/resolvers';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import {
  DatabaseEventBus,
  DatabaseFacade,
  IncompatibleVocabularyModel,
  ModelFactory,
  SessionModel,
  SetModel,
  VocabularyModel,
} from '@ulangi/ulangi-local-database';
import axios from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { createRequest } from '../utils/createRequest';
import { DownloadIncompatibleVocabularySaga } from './DownloadIncompatibleVocabularySaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  SessionModel: SessionModelMock,
  VocabularyModel: VocabularyModelMock,
  IncompatibleVocabularyModel: IncompatibleVocabularyModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('DownloadIncompatibleVocabularySaga', (): void => {
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
    let syncVocabularySaga: DownloadIncompatibleVocabularySaga;
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

        syncVocabularySaga = new DownloadIncompatibleVocabularySaga(
          mockedUserDatabase,
          mockedSharedDatabase,
          mockedSessionModel,
          mockedVocabularyModel,
          mockedIncompatibleVocabularyModel
        );
      }
    );

    describe('Test downloadIncompatibleVocabulary', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            syncVocabularySaga.downloadIncompatibleVocabulary.bind(
              syncVocabularySaga,
              apiUrl,
              downloadLimit,
              transactionChunkSize,
              delayBetweenChunks
            )
          );
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('download incompatible vocabulary success flow', async (): Promise<
        void
      > => {
        const accessToken = 'accessToken';
        const latestSyncTime = moment().toDate();
        const setId = 'setId';

        // These vocabulary should not be inserted to database
        // as their lastSyncedAt > latestSyncTime
        const passedLatestSyncTimeList = Array(4)
          .fill(null)
          .map(
            (_, index): Vocabulary => {
              return new VocabularyBuilder().build({
                vocabularyText:
                  'vocabulary with lastSyncedAt > latestSyncTime' + index,
                lastSyncedAt: moment()
                  .add(1, 'hour')
                  .toDate(),
              });
            }
          );

        // These vocabulary is still incompatible
        const stillIncompatibleVocabularyList = Array(4)
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
                lastSyncedAt: moment().toDate(),
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
          ...passedLatestSyncTimeList,
          ...stillIncompatibleVocabularyList,
          ...compatibleVocabularyList,
        ];

        const allVocabularyList = new VocabularyResolver().resolveArray(
          unresolvedVocabularyList,
          true
        );

        const allVocabularyIds = allVocabularyList.map(
          (vocabulary): string => vocabulary.vocabularyId
        );
        const vocabularySetIdPairs = allVocabularyList.map(
          (vocabulary): [string, string] => {
            return [vocabulary.vocabularyId, setId];
          }
        );

        const vocabularySetIdMap = _.fromPairs(vocabularySetIdPairs);

        const toBeInsertedVocabularyList = allVocabularyList.filter(
          (vocabulary): boolean =>
            vocabulary.lastSyncedAt !== null &&
            vocabulary.lastSyncedAt <= latestSyncTime
        );

        const chunks = _.chunk(
          toBeInsertedVocabularyList,
          transactionChunkSize
        );

        const response = {
          data: {
            vocabularyList: unresolvedVocabularyList,
            vocabularySetIdPairs,
          },
        };

        const existingVocabularyIds = toBeInsertedVocabularyList
          .filter((_, index): boolean => index % 2 === 0)
          .map((vocabulary): string => vocabulary.vocabularyId);

        saga
          .provide([
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [
              matchers.call.fn(mockedVocabularyModel.getLatestSyncTime),
              latestSyncTime,
            ],
            [
              matchers.call.fn(
                mockedIncompatibleVocabularyModel.getIncompatibleVocabularyIdsForRedownload
              ),
              { vocabularyIds: allVocabularyIds },
            ],
            [matchers.call.fn(axios.request), response],
            [
              matchers.call.fn(mockedVocabularyModel.vocabularyIdsExist),
              existingVocabularyIds,
            ],
          ])
          .put(
            createAction(
              ActionType.VOCABULARY__DOWNLOADING_INCOMPATIBLE_VOCABULARY,
              null
            )
          )
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
            [mockedVocabularyModel, 'getLatestSyncTime'],
            mockedUserDatabase
          )
          .call(
            [
              mockedIncompatibleVocabularyModel,
              'getIncompatibleVocabularyIdsForRedownload',
            ],
            mockedUserDatabase,
            currentComparableCommonVersion,
            downloadLimit,
            true
          )
          .call(
            [axios, 'request'],
            createRequest<DownloadSpecificVocabularyRequest>(
              'post',
              apiUrl,
              '/download-specific-vocabulary',
              null,
              {
                vocabularyIds: allVocabularyIds,
              },
              { accessToken }
            )
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
            saga.call
              .fn(mockedUserDatabase.transaction)
              .delay(delayBetweenChunks);
          }
        );

        await saga
          .put(
            createAction(
              ActionType.VOCABULARY__DOWNLOAD_INCOMPATIBLE_VOCABULARY_SUCCEEDED,
              {
                vocabularyList: compatibleVocabularyList,
              }
            )
          )
          .returns({ success: true, noMore: false })
          .run(10000);

        chunks.forEach(
          (chunk): void => {
            expect(
              mockedVocabularyModel.insertMultipleVocabulary
            ).toHaveBeenCalledWith(
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
            ).toHaveBeenCalledWith(
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
              mockedIncompatibleVocabularyModel.deleteMultipleIncompatibleVocabulary
            ).toHaveBeenCalledWith(
              mockedTransaction,
              chunk.map((vocabulary): string => vocabulary.vocabularyId)
            );

            expect(
              mockedIncompatibleVocabularyModel.upsertMultipleIncompatibleVocabulary
            ).toHaveBeenCalledWith(
              mockedTransaction,
              stillIncompatibleVocabularyList
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

    // Integration tests
    describe('Tests start with connected database', (): void => {
      let databaseFacade: DatabaseFacade;
      let userDb: SQLiteDatabase;
      let modelFactory: ModelFactory;
      let setModel: SetModel;
      let vocabularyModel: VocabularyModel;
      let incompatibleVocabularyModel: IncompatibleVocabularyModel;

      beforeEach(
        async (): Promise<void> => {
          databaseFacade = new DatabaseFacade(
            new SQLiteDatabaseAdapter(sqlite3)
          );
          await databaseFacade.connectUserDb((await tmp.file()).path);
          await databaseFacade.checkUserDb();
          userDb = databaseFacade.getDb('user');

          modelFactory = new ModelFactory(new DatabaseEventBus());
          setModel = modelFactory.createModel('setModel');
          vocabularyModel = modelFactory.createModel('vocabularyModel');
          incompatibleVocabularyModel = modelFactory.createModel(
            'incompatibleVocabularyModel'
          );

          syncVocabularySaga = new DownloadIncompatibleVocabularySaga(
            userDb,
            mockedSharedDatabase,
            mockedSessionModel,
            vocabularyModel,
            incompatibleVocabularyModel
          );
        }
      );

      describe('Tests start after inserting some sets into database', (): void => {
        let setList: readonly Set[];
        let restoreCurrentTime: () => void;

        beforeEach(
          async (): Promise<void> => {
            restoreCurrentTime = mockCurrentTime();
            setList = Array(2)
              .fill(null)
              .map(
                (set, index): Set => {
                  return new SetBuilder().build({
                    setName: 'setName' + index,
                    learningLanguageCode: 'en',
                    translatedToLanguageCode: 'en',
                  });
                }
              );

            await userDb.transaction(
              (tx): void => {
                setModel.insertSets(tx, setList, 'remote');
              }
            );
          }
        );

        afterEach(
          (): void => {
            restoreCurrentTime();
          }
        );

        describe('Tests start after inserting some vocabulary and incompatible vocabulary into database', (): void => {
          let existingVocabularyList: readonly Vocabulary[];
          let existingIncompatibleVocabularyIds: readonly string[];
          let latestSyncTime: Date;

          let restoreCurrentTime: () => void;
          beforeEach(
            async (): Promise<void> => {
              restoreCurrentTime = mockCurrentTime();
              latestSyncTime = moment().toDate();
              existingVocabularyList = Array(8)
                .fill(null)
                .map(
                  (_, index): Vocabulary => {
                    return new VocabularyBuilder().build({
                      vocabularyText: 'vocabularyText' + index,
                      vocabularyStatus: VocabularyStatus.ACTIVE,
                      lastSyncedAt: latestSyncTime,
                      definitions: [
                        new DefinitionBuilder().build({
                          meaning: 'meaning' + index,
                          source: 'source',
                        }),
                      ],
                    });
                  }
                );

              existingIncompatibleVocabularyIds = existingVocabularyList.map(
                (vocabulary): string => vocabulary.vocabularyId
              );

              await userDb.transaction(
                (tx): void => {
                  vocabularyModel.insertMultipleVocabulary(
                    tx,
                    existingVocabularyList.map(
                      (vocabulary, index): [Vocabulary, string] => [
                        vocabulary,
                        setList[index % setList.length].setId,
                      ]
                    ),
                    'remote'
                  );
                  incompatibleVocabularyModel.upsertMultipleIncompatibleVocabulary(
                    tx,
                    existingIncompatibleVocabularyIds,
                    '0000.0000.0001'
                  );
                }
              );
            }
          );

          afterEach(
            (): void => {
              restoreCurrentTime();
            }
          );

          describe('Test downloadIncompatibleVocabulary', (): void => {
            beforeEach(
              (): void => {
                saga = expectSaga(
                  syncVocabularySaga.downloadIncompatibleVocabulary.bind(
                    syncVocabularySaga,
                    apiUrl,
                    downloadLimit,
                    transactionChunkSize,
                    delayBetweenChunks
                  )
                );
              }
            );

            test('download incompatible vocabulary success flow', async (): Promise<
              void
            > => {
              const accessToken = 'accessToken';

              const stillIncompatibleVocabularyList = existingVocabularyList
                .filter((_, index): boolean => index % 2 === 0)
                .map(
                  (vocabulary, index): Vocabulary => {
                    return new VocabularyBuilder().build({
                      ...vocabulary,
                      vocabularyText: 'incompatible vocabulary' + index,
                      lastSyncedAt: moment().toDate(),
                      unknownProps: 'unknownProps',
                    } as any);
                  }
                );

              const compatibleVocabularyList = existingVocabularyList
                .filter((_, index): boolean => index % 2 !== 0)
                .map(
                  (vocabulary, index): Vocabulary => {
                    return new VocabularyBuilder().build({
                      ...vocabulary,
                      vocabularyText: 'compatible vocabulary' + index,
                      lastSyncedAt: moment().toDate(),
                      definitions: [
                        ...vocabulary.definitions,
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
                ...stillIncompatibleVocabularyList,
                ...compatibleVocabularyList,
              ];

              const toBeInsertedVocabularyList = new VocabularyResolver().resolveArray(
                unresolvedVocabularyList,
                true
              );

              const vocabularySetIdPairs = toBeInsertedVocabularyList.map(
                (vocabulary): [string, string] => {
                  return [vocabulary.vocabularyId, setList[0].setId];
                }
              );

              const response = {
                data: {
                  vocabularyList: unresolvedVocabularyList,
                  vocabularySetIdPairs,
                },
              };

              await saga
                .provide([
                  [
                    matchers.call.fn(mockedSessionModel.getAccessToken),
                    accessToken,
                  ],
                  [matchers.call.fn(axios.request), response],
                ])
                .returns({ success: true, noMore: false })
                .run(10000);

              for (const vocabulary of toBeInsertedVocabularyList) {
                const { vocabulary: fetchedVocabulary } = assertExists(
                  await vocabularyModel.getVocabularyById(
                    userDb,
                    vocabulary.vocabularyId,
                    true
                  )
                );

                expect(fetchedVocabulary).toEqual(vocabulary);
              }

              const {
                vocabularyIds: fetchedIncompatibleVocabularyIds,
              } = await incompatibleVocabularyModel.getIncompatibleVocabularyIdsForRedownload(
                userDb,
                '9999.9999.9999',
                downloadLimit,
                true
              );

              expect(fetchedIncompatibleVocabularyIds).toIncludeSameMembers(
                stillIncompatibleVocabularyList.map(
                  (vocabulary): string => vocabulary.vocabularyId
                )
              );
            });
          });
        });
      });
    });
  });
});
