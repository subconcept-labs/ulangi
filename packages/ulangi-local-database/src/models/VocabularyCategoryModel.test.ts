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

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyVocabularyCategoryModel } from './DirtyVocabularyCategoryModel';
import { SetModel } from './SetModel';
import { VocabularyCategoryModel } from './VocabularyCategoryModel';
import { VocabularyModel } from './VocabularyModel';

describe('VocabularyCategoryModel', (): void => {
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

      test('local upsert vocabulary category successfully', async (): Promise<
        void
      > => {
        const vocabularyCategory = new VocabularyCategoryBuilder().build({
          categoryName: 'someCategory',
        });

        await userDb.transaction(
          (tx): void => {
            vocabularyCategoryModel.upsertVocabularyCategory(
              tx,
              vocabularyCategory,
              vocabularyList[0].vocabularyId,
              'local'
            );
          }
        );
      });

      test('local upsert multiple vocabulary category successfully', async (): Promise<
        void
      > => {
        let vocabularyCategoryVocabularyIdPairs = vocabularyList.map(
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

        const {
          vocabularyCategoryPerVocabularyId,
        } = await vocabularyCategoryModel.getVocabularyCategoryByVocabularyIds(
          userDb,
          vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
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

      test('local upsert vocabulary category failed if vocabularyId does not exist (foreign key constraint)', async (): Promise<
        void
      > => {
        const vocabularyCategory = new VocabularyCategoryBuilder().build({
          categoryName: 'someCategory',
        });

        await expect(
          userDb.transaction(
            (tx): void => {
              vocabularyCategoryModel.upsertVocabularyCategory(
                tx,
                vocabularyCategory,
                'unknownVocabularyId',
                'local'
              );
            }
          )
        ).rejects.toThrow();
      });

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

        test('get vocabulary category by vocabulary id', async (): Promise<
          void
        > => {
          const {
            vocabularyCategory,
          } = await vocabularyCategoryModel.getVocabularyCategoryByVocabularyId(
            userDb,
            vocabularyList[0].vocabularyId,
            true
          );

          expect(vocabularyCategory).toEqual(
            vocabularyCategoryVocabularyIdPairs[0][0]
          );
        });

        test('get vocabulary category by vocabulary ids', async (): Promise<
          void
        > => {
          const {
            vocabularyCategoryPerVocabularyId,
          } = await vocabularyCategoryModel.getVocabularyCategoryByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
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

        test('return empty object if there are no vocabulary categories ', async (): Promise<
          void
        > => {
          const {
            vocabularyCategoryPerVocabularyId,
          } = await vocabularyCategoryModel.getVocabularyCategoryByVocabularyIds(
            userDb,
            ['randomId'],
            true
          );

          expect(vocabularyCategoryPerVocabularyId).toEqual({});
        });

        test('local upsert categories should overwrite existing rows', async (): Promise<
          void
        > => {
          let newVocabularyCategoryVocabularyIdPairs = vocabularyList.map(
            (vocabulary): [DeepPartial<VocabularyCategory>, string] => {
              return [
                { categoryName: 'edited category' },
                vocabulary.vocabularyId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              vocabularyCategoryModel.upsertVocabularyCategories(
                tx,
                newVocabularyCategoryVocabularyIdPairs,
                'local'
              );
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await vocabularyCategoryModel.getVocabularyCategoryByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyCategoryVocabularyIdPairs.forEach(
            ([vocabularyCategory, vocabularyId]): void => {
              expect(vocabularyCategoryPerVocabularyId[vocabularyId]).toEqual({
                ...vocabularyCategory,
                categoryName: 'edited category',
              });
            }
          );
        });

        test('local upsert categories should not change createdAt, firstSyncedAt & lastSyncedAt', async (): Promise<
          void
        > => {
          let newVocabularyCategoryVocabularyIdPairs = vocabularyList.map(
            (vocabulary): [DeepPartial<VocabularyCategory>, string] => {
              return [
                {
                  categoryName: 'edited category',
                  createdAt: moment()
                    .subtract(1, 'hour')
                    .toDate(),
                  firstSyncedAt: moment()
                    .subtract(2, 'hour')
                    .toDate(),
                  lastSyncedAt: moment()
                    .subtract(3, 'hour')
                    .toDate(),
                },
                vocabulary.vocabularyId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              vocabularyCategoryModel.upsertVocabularyCategories(
                tx,
                newVocabularyCategoryVocabularyIdPairs,
                'local'
              );
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await vocabularyCategoryModel.getVocabularyCategoryByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyCategoryVocabularyIdPairs.forEach(
            ([vocabularyCategory, vocabularyId]): void => {
              expect(vocabularyCategoryPerVocabularyId[vocabularyId]).toEqual({
                ...vocabularyCategory,
                categoryName: 'edited category',
              });
            }
          );
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

        test('remote upsert categories should not mark records as dirty', async (): Promise<
          void
        > => {
          const {
            vocabularyCategoryPerVocabularyId,
          } = await dirtyVocabularyCategoryModel.getDirtyVocabularyCategoryForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          expect(vocabularyCategoryPerVocabularyId).toEqual({});
        });

        test('remote upsert categories should overwrite only clean rows', async (): Promise<
          void
        > => {
          const firstVocabularyCategoryVocabularyIdPairs = vocabularyList.map(
            (vocabulary): [DeepPartial<VocabularyCategory>, string] => {
              return [
                {
                  categoryName: 'first edited category',
                },
                vocabulary.vocabularyId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              vocabularyCategoryModel.upsertVocabularyCategories(
                tx,
                firstVocabularyCategoryVocabularyIdPairs,
                'local'
              );
            }
          );

          const secondVocabularyCategoryVocabularyIdPairs = vocabularyList.map(
            (vocabulary): [DeepPartial<VocabularyCategory>, string] => {
              return [
                {
                  categoryName: 'second edited category',
                  firstSyncedAt: moment().toDate(),
                  lastSyncedAt: moment().toDate(),
                },
                vocabulary.vocabularyId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              vocabularyCategoryModel.upsertVocabularyCategories(
                tx,
                secondVocabularyCategoryVocabularyIdPairs,
                'remote'
              );
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await vocabularyCategoryModel.getVocabularyCategoryByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyCategoryVocabularyIdPairs.forEach(
            ([vocabularyCategory, vocabularyId]): void => {
              expect(vocabularyCategoryPerVocabularyId[vocabularyId]).toEqual({
                ...vocabularyCategory,
                categoryName: 'first edited category',
              });
            }
          );
        });
      });
    });
  });
});
