/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import {
  SetBuilder,
  VocabularyBuilder,
  VocabularyCategoryBuilder,
} from '@ulangi/ulangi-common/builders';
import { SetStatus, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import {
  Set,
  Vocabulary,
  VocabularyCategory,
} from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { FieldState } from '../enums/FieldState';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyVocabularyCategoryModel } from './DirtyVocabularyCategoryModel';
import { SetModel } from './SetModel';
import { VocabularyCategoryModel } from './VocabularyCategoryModel';
import { VocabularyModel } from './VocabularyModel';

describe('DirtyVocabularyCategoryModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let databaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let vocabularyCategoryModel: VocabularyCategoryModel;
    let vocabularyModel: VocabularyModel;
    let dirtyVocabularyCategoryModel: DirtyVocabularyCategoryModel;
    let restoreCurrentTime: () => void;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(new SQLiteDatabaseAdapter(sqlite3));
        databaseEventBus = new DatabaseEventBus();
        await databaseFacade.connectUserDb((await tmp.file()).path);
        await databaseFacade.checkUserDb();
        userDb = databaseFacade.getDb('user');

        modelFactory = new ModelFactory(databaseEventBus);
        setModel = modelFactory.createModel('setModel');
        vocabularyCategoryModel = modelFactory.createModel(
          'vocabularyCategoryModel'
        );
        vocabularyModel = modelFactory.createModel('vocabularyModel');
        dirtyVocabularyCategoryModel = modelFactory.createModel(
          'dirtyVocabularyCategoryModel'
        );

        restoreCurrentTime = mockCurrentTime();
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    describe('Tests start after inserting a set and some vocabulary from local', (): void => {
      let set: Set;
      let vocabularyList: readonly Vocabulary[];
      beforeEach(
        async (): Promise<void> => {
          set = new SetBuilder().build({
            setId: 'setId',
            setStatus: SetStatus.ACTIVE,
            setName: 'setName',
            learningLanguageCode: 'en',
            translatedToLanguageCode: 'en',
          });

          vocabularyList = Array(4)
            .fill(null)
            .map(
              (_, index): Vocabulary => {
                return new VocabularyBuilder().build({
                  vocabularyId: 'vocabularyId' + index,
                  vocabularyStatus:
                    index % 2 === 0
                      ? VocabularyStatus.ACTIVE
                      : VocabularyStatus.ARCHIVED,
                  vocabularyText: 'vocabularyText' + index,
                });
              }
            );

          await userDb.transaction(
            (tx): void => {
              setModel.insertSet(tx, set, 'local');
              vocabularyModel.insertMultipleVocabulary(
                tx,
                vocabularyList.map(
                  (vocabulary): [Vocabulary, string] => [vocabulary, set.setId]
                ),
                'local'
              );
            }
          );
        }
      );

      describe('Test starts after adding vocabulary categories from local', (): void => {
        let vocabularyCategoryVocabularyIdPairs: readonly [
          VocabularyCategory,
          string
        ][];

        beforeEach(
          async (): Promise<void> => {
            vocabularyCategoryVocabularyIdPairs = vocabularyList.map(
              (vocabulary, index): [VocabularyCategory, string] => {
                return [
                  new VocabularyCategoryBuilder().build({
                    categoryName: 'categoryName' + index,
                  }),
                  vocabulary.vocabularyId,
                ];
              }
            );

            await userDb.transaction(
              (tx): void => {
                vocabularyCategoryModel.upsertVocabularyCategories(
                  tx,
                  vocabularyCategoryVocabularyIdPairs,
                  'local'
                );
              }
            );
          }
        );

        test('mark records as synced', async (): Promise<void> => {
          const {
            markVocabularyCategoriesAsSynced,
          } = await dirtyVocabularyCategoryModel.getDirtyVocabularyCategoryForSyncing(
            userDb,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          const syncedVocabularyIds = vocabularyCategoryVocabularyIdPairs
            .filter((_, index): boolean => index % 2 === 0)
            .map(([, vocabularyId]): string => vocabularyId);

          await userDb.transaction(
            (tx): void => {
              markVocabularyCategoriesAsSynced(tx, syncedVocabularyIds);
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await dirtyVocabularyCategoryModel.getDirtyVocabularyCategoryForSyncing(
            userDb,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          vocabularyCategoryVocabularyIdPairs.forEach(
            ([vocabularyCategory, vocabularyId], index): void => {
              if (index % 2 !== 0) {
                expect(vocabularyCategoryPerVocabularyId[vocabularyId]).toEqual(
                  vocabularyCategory
                );
              } else {
                expect(
                  vocabularyCategoryPerVocabularyId[vocabularyId]
                ).toBeUndefined();
              }
            }
          );
        });

        test('transition to SYNCED state', async (): Promise<void> => {
          await userDb.transaction(
            (tx): void => {
              dirtyVocabularyCategoryModel.transitionFieldStates(
                tx,
                vocabularyCategoryVocabularyIdPairs.map(
                  ([, vocabularyId]): string => vocabularyId
                ),
                { toState: FieldState.SYNCED }
              );
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await dirtyVocabularyCategoryModel.getDirtyVocabularyCategoryForSyncing(
            userDb,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          expect(vocabularyCategoryPerVocabularyId).toEqual({});
        });

        test('transition from SYNCING to SYNCED', async (): Promise<void> => {
          // This will transition from TO_BE_SYNCED to SYNCING
          await dirtyVocabularyCategoryModel.getDirtyVocabularyCategoryForSyncing(
            userDb,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          await userDb.transaction(
            (tx): void => {
              dirtyVocabularyCategoryModel.transitionFieldStates(
                tx,
                vocabularyCategoryVocabularyIdPairs.map(
                  ([, vocabularyId]): string => vocabularyId
                ),
                { fromState: FieldState.SYNCING, toState: FieldState.SYNCED }
              );
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await dirtyVocabularyCategoryModel.getDirtyVocabularyCategoryForSyncing(
            userDb,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          expect(vocabularyCategoryPerVocabularyId).toEqual({});
        });
      });

      describe('Test starts after adding vocabulary categories from remote', (): void => {
        let vocabularyCategoryVocabularyIdPairs: readonly [
          VocabularyCategory,
          string
        ][];

        beforeEach(
          async (): Promise<void> => {
            vocabularyCategoryVocabularyIdPairs = vocabularyList.map(
              (vocabulary, index): [VocabularyCategory, string] => {
                return [
                  new VocabularyCategoryBuilder().build({
                    categoryName: 'categoryName' + index,
                  }),
                  vocabulary.vocabularyId,
                ];
              }
            );

            await userDb.transaction(
              (tx): void => {
                vocabularyCategoryModel.upsertVocabularyCategories(
                  tx,
                  vocabularyCategoryVocabularyIdPairs,
                  'remote'
                );
              }
            );
          }
        );

        test('transition to TO_BE_SYNCED state', async (): Promise<void> => {
          await userDb.transaction(
            (tx): void => {
              dirtyVocabularyCategoryModel.transitionFieldStates(
                tx,
                vocabularyCategoryVocabularyIdPairs.map(
                  ([, vocabularyId]): string => vocabularyId
                ),
                { toState: FieldState.TO_BE_SYNCED }
              );
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await dirtyVocabularyCategoryModel.getDirtyVocabularyCategoryForSyncing(
            userDb,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          vocabularyCategoryVocabularyIdPairs.forEach(
            ([vocabularyCategory, vocabularyId]): void => {
              expect(vocabularyCategoryPerVocabularyId[vocabularyId]).toEqual(
                vocabularyCategory
              );
            }
          );
        });

        test('transition from all states except SYNCED state to SYNCING', async (): Promise<
          void
        > => {
          await userDb.transaction(
            (tx): void => {
              dirtyVocabularyCategoryModel.transitionFieldStates(
                tx,
                vocabularyCategoryVocabularyIdPairs.map(
                  ([, vocabularyId]): string => vocabularyId
                ),
                {
                  fromAllStatesExcept: FieldState.SYNCED,
                  toState: FieldState.SYNCING,
                }
              );
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await vocabularyCategoryModel.getVocabularyCategoryByVocabularyIds(
            userDb,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          vocabularyCategoryVocabularyIdPairs.forEach(
            ([vocabularyCategory, vocabularyId]): void => {
              expect(vocabularyCategoryPerVocabularyId[vocabularyId]).toEqual(
                vocabularyCategory
              );
            }
          );
        });

        test('get dirty vocabulary categories should return only dirty fields', async (): Promise<
          void
        > => {
          await userDb.transaction(
            (tx): void => {
              vocabularyCategoryModel.upsertVocabularyCategories(
                tx,
                vocabularyCategoryVocabularyIdPairs.map(
                  ([, vocabularyId]): [
                    DeepPartial<VocabularyCategory>,
                    string
                  ] => [
                    {
                      categoryName: 'edited category name',
                    },
                    vocabularyId,
                  ]
                ),
                'local'
              );
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await dirtyVocabularyCategoryModel.getDirtyVocabularyCategoryForSyncing(
            userDb,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          vocabularyCategoryVocabularyIdPairs.forEach(
            ([, vocabularyId]): void => {
              expect(vocabularyCategoryPerVocabularyId[vocabularyId]).toEqual({
                categoryName: 'edited category name',
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
