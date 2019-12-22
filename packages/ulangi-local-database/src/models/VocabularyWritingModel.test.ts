/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import {
  Set,
  Vocabulary,
  VocabularyWriting,
} from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyVocabularyWritingModel } from './DirtyVocabularyWritingModel';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';
import { VocabularyWritingModel } from './VocabularyWritingModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('VocabularyWritingModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let mockedDatabaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let vocabularyModel: VocabularyModel;
    let vocabularyWritingModel: VocabularyWritingModel;
    let dirtyVocabularyWritingModel: DirtyVocabularyWritingModel;
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
        vocabularyWritingModel = modelFactory.createModel(
          'vocabularyWritingModel'
        );
        vocabularyModel = modelFactory.createModel('vocabularyModel');
        dirtyVocabularyWritingModel = modelFactory.createModel(
          'dirtyVocabularyWritingModel'
        );

        restoreCurrentTime = mockCurrentTime();
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    test('local upsert failed due to foreign contraints', async (): Promise<
      void
    > => {
      const vocabularyWriting = {
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
      };

      await expect(
        userDb.transaction(
          (tx): void => {
            vocabularyWritingModel.upsertVocabularyWriting(
              tx,
              vocabularyWriting,
              'vocabularyId',
              'local'
            );
          }
        )
      ).rejects.toThrow();
    });

    describe('Tests start after inserting some sets from remote', (): void => {
      let setList: readonly Set[];

      beforeEach(
        async (): Promise<void> => {
          setList = Array(2)
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
              setModel.insertSets(tx, setList, 'remote');
            }
          );
        }
      );

      describe('Tests start after inserting some vocabulary with definitions, writing and category from local', (): void => {
        let vocabularyList: readonly Vocabulary[];

        beforeEach(
          async (): Promise<void> => {
            vocabularyList = Array(4)
              .fill(null)
              .map(
                (_, index): Vocabulary => {
                  return new VocabularyBuilder().build({
                    vocabularyText: 'vocabularyText' + index,
                    vocabularyStatus: VocabularyStatus.ACTIVE,
                    definitions: [
                      {
                        meaning: 'meaning' + index,
                        source: 'source',
                      },
                    ],
                    category: {
                      categoryName: 'category' + index,
                    },
                    writing: {
                      lastWrittenAt: moment().toDate(),
                      disabled: false,
                      level: 0,
                    },
                  });
                }
              );

            await userDb.transaction(
              (tx): void => {
                vocabularyModel.insertMultipleVocabulary(
                  tx,
                  vocabularyList.map(
                    (vocabulary): [Vocabulary, string] => [
                      vocabulary,
                      setList[0].setId,
                    ]
                  ),
                  'local'
                );
              }
            );

            jest.clearAllMocks();
          }
        );

        test('get vocabulary writing by vocabulary ids', async (): Promise<
          void
        > => {
          const {
            vocabularyWritingPerVocabularyId,
          } = await vocabularyWritingModel.getVocabularyWritingsByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyList.forEach(
            (vocabulary): void => {
              expect(
                vocabularyWritingPerVocabularyId[vocabulary.vocabularyId]
              ).toEqual({
                ...vocabulary.writing,
                firstSyncedAt: null,
                lastSyncedAt: null,
              });
            }
          );
        });

        test('local upsert should mark records as dirty', async (): Promise<
          void
        > => {
          const {
            vocabularyWritingPerVocabularyId,
          } = await dirtyVocabularyWritingModel.getDirtyVocabularyWritingsForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyList.forEach(
            (vocabulary): void => {
              expect(
                vocabularyWritingPerVocabularyId[vocabulary.vocabularyId]
              ).toEqual(vocabulary.writing);
            }
          );
        });

        test('local upsert should overwite existing rows', async (): Promise<
          void
        > => {
          const editedVocabularyWritingVocabularyIdPairs = vocabularyList.map(
            (vocabulary): [DeepPartial<Vocabulary>, string] => {
              return [
                {
                  level: 5,
                },
                vocabulary.vocabularyId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              vocabularyWritingModel.upsertVocabularyWritings(
                tx,
                editedVocabularyWritingVocabularyIdPairs,
                'local'
              );
            }
          );

          const {
            vocabularyWritingPerVocabularyId,
          } = await vocabularyWritingModel.getVocabularyWritingsByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyList.forEach(
            (vocabulary): void => {
              expect(
                vocabularyWritingPerVocabularyId[vocabulary.vocabularyId]
              ).toEqual({
                ...vocabulary.writing,
                level: 5,
                firstSyncedAt: null,
                lastSyncedAt: null,
              });
            }
          );
        });
      });

      describe('Tests start after inserting some vocabulary with definitions, writing and category from remote', (): void => {
        let vocabularyList: Vocabulary[];

        beforeEach(
          async (): Promise<void> => {
            vocabularyList = Array(4)
              .fill(null)
              .map(
                (_, index): Vocabulary => {
                  return new VocabularyBuilder().build({
                    vocabularyText: 'vocabularyText' + index,
                    vocabularyStatus: VocabularyStatus.ACTIVE,
                    definitions: [
                      {
                        meaning: 'meaning' + index,
                        source: 'source',
                      },
                    ],
                    category: {
                      categoryName: 'category' + index,
                    },
                    writing: {
                      lastWrittenAt: moment().toDate(),
                      disabled: false,
                      level: 0,
                    },
                  });
                }
              );

            await userDb.transaction(
              (tx): void => {
                vocabularyModel.insertMultipleVocabulary(
                  tx,
                  vocabularyList.map(
                    (vocabulary): [Vocabulary, string] => [
                      vocabulary,
                      setList[0].setId,
                    ]
                  ),
                  'remote'
                );
              }
            );

            jest.clearAllMocks();
          }
        );

        test('remote upsert should not mark records as dirty', async (): Promise<
          void
        > => {
          const {
            vocabularyWritingPerVocabularyId,
          } = await dirtyVocabularyWritingModel.getDirtyVocabularyWritingsForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          expect(vocabularyWritingPerVocabularyId).toEqual({});
        });

        test('remote upsert should not overwrite dirty records', async (): Promise<
          void
        > => {
          const firstVocabularyWritingVocabularyIdPairs = vocabularyList.map(
            (vocabulary): [DeepPartial<VocabularyWriting>, string] => {
              return [
                {
                  level: 5,
                  createdAt: moment().toDate(),
                  updatedAt: moment().toDate(),
                  firstSyncedAt: moment().toDate(),
                  lastSyncedAt: moment().toDate(),
                },
                vocabulary.vocabularyId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              vocabularyWritingModel.upsertVocabularyWritings(
                tx,
                firstVocabularyWritingVocabularyIdPairs,
                'local'
              );
            }
          );

          const secondVocabularyWritingVocabularyIdPairs = vocabularyList.map(
            (vocabulary): [DeepPartial<VocabularyWriting>, string] => {
              return [
                {
                  level: 8,
                  createdAt: moment().toDate(),
                  updatedAt: moment().toDate(),
                  firstSyncedAt: moment().toDate(),
                  lastSyncedAt: moment().toDate(),
                },
                vocabulary.vocabularyId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              vocabularyWritingModel.upsertVocabularyWritings(
                tx,
                secondVocabularyWritingVocabularyIdPairs,
                'remote'
              );
            }
          );

          const {
            vocabularyWritingPerVocabularyId,
          } = await vocabularyWritingModel.getVocabularyWritingsByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyList.forEach(
            (vocabulary): void => {
              expect(
                vocabularyWritingPerVocabularyId[vocabulary.vocabularyId]
              ).toEqual({
                ...vocabulary.writing,
                level: 5,
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
                firstSyncedAt: null,
                lastSyncedAt: null,
              });
            }
          );
        });
      });
    });
  });
});
