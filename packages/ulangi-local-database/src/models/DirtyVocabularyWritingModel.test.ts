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
import * as _ from 'lodash';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { FieldState } from '../enums/FieldState';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyVocabularyWritingFieldRow } from '../interfaces/DirtyVocabularyWritingFieldRow';
import { DirtyVocabularyWritingModel } from './DirtyVocabularyWritingModel';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';
import { VocabularyWritingModel } from './VocabularyWritingModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('DirtyVocabularyWritingModel', (): void => {
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

        test('mark records as synced', async (): Promise<void> => {
          const {
            markVocabularyWritingsAsSynced,
          } = await dirtyVocabularyWritingModel.getDirtyVocabularyWritingsForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          const syncedVocabularyIds = vocabularyList
            .filter(
              (_, index): boolean => {
                return index % 2 === 0;
              }
            )
            .map((vocabulary): string => vocabulary.vocabularyId);

          await userDb.transaction(
            (tx): void => {
              markVocabularyWritingsAsSynced(tx, syncedVocabularyIds);
            }
          );

          const {
            vocabularyWritingPerVocabularyId,
          } = await dirtyVocabularyWritingModel.getDirtyVocabularyWritingsForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyList.forEach(
            (vocabulary): void => {
              if (_.includes(syncedVocabularyIds, vocabulary.vocabularyId)) {
                expect(
                  vocabularyWritingPerVocabularyId[vocabulary.vocabularyId]
                ).toBeUndefined();
              } else {
                expect(
                  vocabularyWritingPerVocabularyId[vocabulary.vocabularyId]
                ).toEqual(vocabulary.writing);
              }
            }
          );
        });

        test('delete dirty fields', async (): Promise<void> => {
          await userDb.transaction(
            (tx): void => {
              dirtyVocabularyWritingModel.deleteDirtyFields(
                tx,
                vocabularyList.map(
                  (
                    vocabulary
                  ): Pick<
                    DirtyVocabularyWritingFieldRow,
                    'vocabularyId' | 'fieldName'
                  > => {
                    return {
                      vocabularyId: vocabulary.vocabularyId,
                      fieldName: 'level',
                    };
                  }
                ),
                { withState: FieldState.TO_BE_SYNCED }
              );
            }
          );

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
              ).toEqual(_.omit(vocabulary.writing, 'level'));
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

        test('get dirty vocabulary writing should only return dirty fields', async (): Promise<
          void
        > => {
          await userDb.transaction(
            (tx): void => {
              vocabularyWritingModel.upsertVocabularyWritings(
                tx,
                vocabularyList.map(
                  (vocabulary): [DeepPartial<VocabularyWriting>, string] => {
                    return [{ level: 8 }, vocabulary.vocabularyId];
                  }
                ),
                'local'
              );
            }
          );

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
              ).toEqual({
                level: 8,
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
