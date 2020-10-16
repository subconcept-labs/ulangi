/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { WritingScheduler } from '@ulangi/ulangi-common/core';
import {
  VocabularySortType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';
import { WritingModel } from './WritingModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('WritingModel', (): void => {
  const initialInterval = 12;
  const maxLevel = 10;
  const limit = 30;

  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let mockedDatabaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let vocabularyModel: VocabularyModel;
    let writingModel: WritingModel;
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
        vocabularyModel = modelFactory.createModel('vocabularyModel');
        writingModel = modelFactory.createModel('writingModel');

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

      describe('Tests start after inserting terms from local', (): void => {
        let vocabularyList: Vocabulary[];

        beforeEach(
          async (): Promise<void> => {
            const new_terms = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  lastWrittenAt: null,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  lastWrittenAt: null,
                  disabled: true,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ARCHIVED,
                vocabularyText: 'vocabulary',
              }),
            ];

            const new_terms_with_category = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                category: {
                  categoryName: 'Uncategorized',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  lastWrittenAt: null,
                },
                category: {
                  categoryName: 'category2',
                },
              }),
            ];

            const learned_terms = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: moment()
                    .subtract(initialInterval + 1, 'hours')
                    .toDate(),
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: moment()
                    .subtract(initialInterval - 1, 'hours')
                    .toDate(),
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  disabled: true,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.DELETED,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: moment()
                    .subtract(initialInterval + 1, 'hours')
                    .toDate(),
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ARCHIVED,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: moment()
                    .subtract(initialInterval + 1, 'hours')
                    .toDate(),
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 2,
                  lastWrittenAt: moment()
                    .subtract(initialInterval * 2 + 1, 'hours')
                    .toDate(),
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 2,
                  lastWrittenAt: moment()
                    .subtract(initialInterval * 2 - 1, 'hours')
                    .toDate(),
                },
              }),
            ];

            const learned_terms_with_category = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: moment()
                    .subtract(initialInterval + 1, 'hours')
                    .toDate(),
                },
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: moment()
                    .subtract(initialInterval - 1, 'hours')
                    .toDate(),
                },
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 2,
                  lastWrittenAt: moment()
                    .subtract(initialInterval * 2 + 1, 'hours')
                    .toDate(),
                },
                category: {
                  categoryName: 'category2',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 2,
                  lastWrittenAt: moment()
                    .subtract(initialInterval * 2 - 1, 'hours')
                    .toDate(),
                },
                category: {
                  categoryName: 'category2',
                },
              }),
            ];

            vocabularyList = [
              ...new_terms,
              ...new_terms_with_category,
              ...learned_terms,
              ...learned_terms_with_category,
            ];

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
          }
        );

        test('get new vocabulary list (any categories)', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await writingModel.getNewVocabularyList(
            userDb,
            setList[0].setId,
            undefined,
            VocabularySortType.UNSORTED,
            limit,
            0,
            true
          );

          expect(fetchedVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.lastWrittenAt === null &&
                      vocabulary.writing.disabled === false))
                );
              }
            )
          );
        });

        test('get new vocabulary list with selected categories', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await writingModel.getNewVocabularyList(
            userDb,
            setList[0].setId,
            ['category1'],
            VocabularySortType.UNSORTED,
            limit,
            0,
            true
          );

          expect(fetchedVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.lastWrittenAt === null &&
                      vocabulary.writing.disabled === false)) &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName === 'category1'
                );
              }
            )
          );
        });

        test('get new vocabulary list in Uncategorized category', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await writingModel.getNewVocabularyList(
            userDb,
            setList[0].setId,
            ['Uncategorized'],
            VocabularySortType.UNSORTED,
            limit,
            0,
            true
          );

          expect(fetchedVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.lastWrittenAt === null &&
                      vocabulary.writing.disabled === false)) &&
                  (typeof vocabulary.category === 'undefined' ||
                    vocabulary.category.categoryName === 'Uncategorized')
                );
              }
            )
          );
        });

        test('get due vocabulary list (any categories)', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedDueVocabularyList,
          } = await writingModel.getDueVocabularyList(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            undefined,
            VocabularySortType.SORT_BY_NAME_ASC,
            limit,
            0,
            true
          );

          expect(fetchedDueVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  typeof vocabulary.writing !== 'undefined' &&
                  vocabulary.writing.disabled === false &&
                  vocabulary.writing.lastWrittenAt !== null &&
                  new WritingScheduler().calculateReviewTime(
                    initialInterval,
                    vocabulary.writing.level,
                    vocabulary.writing.lastWrittenAt
                  ) < moment().toDate()
                );
              }
            )
          );
        });

        test('get due vocabulary list with category1', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedDueVocabularyList,
          } = await writingModel.getDueVocabularyList(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            ['category1'],
            VocabularySortType.SORT_BY_NAME_ASC,
            limit,
            0,
            true
          );

          expect(fetchedDueVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName === 'category1' &&
                  typeof vocabulary.writing !== 'undefined' &&
                  vocabulary.writing.disabled === false &&
                  vocabulary.writing.lastWrittenAt !== null &&
                  new WritingScheduler().calculateReviewTime(
                    initialInterval,
                    vocabulary.writing.level,
                    vocabulary.writing.lastWrittenAt
                  ) < moment().toDate()
                );
              }
            )
          );
        });

        test('get due vocabulary list with Uncategorized', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedDueVocabularyListWithUncategorized,
          } = await writingModel.getDueVocabularyList(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            ['Uncategorized'],
            VocabularySortType.SORT_BY_NAME_ASC,
            limit,
            0,
            true
          );

          const expectedResult = vocabularyList.filter(
            (vocabulary): boolean => {
              return (
                vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                (typeof vocabulary.category === 'undefined' ||
                  vocabulary.category.categoryName === 'Uncategorized') &&
                typeof vocabulary.writing !== 'undefined' &&
                vocabulary.writing.disabled === false &&
                vocabulary.writing.lastWrittenAt !== null &&
                new WritingScheduler().calculateReviewTime(
                  initialInterval,
                  vocabulary.writing.level,
                  vocabulary.writing.lastWrittenAt
                ) < moment().toDate()
              );
            }
          );

          expect(
            fetchedDueVocabularyListWithUncategorized
          ).toIncludeSameMembers(expectedResult);
        });

        test('get new count (any categories)', async (): Promise<void> => {
          const newCount = await writingModel.getNewCount(
            userDb,
            setList[0].setId,
            undefined
          );

          expect(newCount).toEqual(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.lastWrittenAt === null &&
                      vocabulary.writing.disabled === false))
                );
              }
            ).length
          );
        });

        test('get new count with selected categories', async (): Promise<
          void
        > => {
          const newCount = await writingModel.getNewCount(
            userDb,
            setList[0].setId,
            ['category1']
          );

          expect(newCount).toEqual(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.lastWrittenAt === null &&
                      vocabulary.writing.disabled === false)) &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName === 'category1'
                );
              }
            ).length
          );
        });

        test('get new count in Uncategorized category', async (): Promise<
          void
        > => {
          const newCount = await writingModel.getNewCount(
            userDb,
            setList[0].setId,
            ['Uncategorized']
          );

          expect(newCount).toEqual(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.lastWrittenAt === null &&
                      vocabulary.writing.disabled === false)) &&
                  (typeof vocabulary.category === 'undefined' ||
                    vocabulary.category.categoryName === 'Uncategorized')
                );
              }
            ).length
          );
        });

        test('get due count (any categories)', async (): Promise<void> => {
          const dueCount = await writingModel.getDueCount(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            undefined
          );

          expect(dueCount).toEqual(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  typeof vocabulary.writing !== 'undefined' &&
                  vocabulary.writing.disabled === false &&
                  vocabulary.writing.lastWrittenAt !== null &&
                  new WritingScheduler().calculateReviewTime(
                    initialInterval,
                    vocabulary.writing.level,
                    vocabulary.writing.lastWrittenAt
                  ) < moment().toDate()
                );
              }
            ).length
          );
        });

        test('get due count with category1', async (): Promise<void> => {
          const dueCount = await writingModel.getDueCount(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            ['category1']
          );

          expect(dueCount).toEqual(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName === 'category1' &&
                  typeof vocabulary.writing !== 'undefined' &&
                  vocabulary.writing.disabled === false &&
                  vocabulary.writing.lastWrittenAt !== null &&
                  new WritingScheduler().calculateReviewTime(
                    initialInterval,
                    vocabulary.writing.level,
                    vocabulary.writing.lastWrittenAt
                  ) < moment().toDate()
                );
              }
            ).length
          );
        });

        test('get due count with Uncategorized', async (): Promise<void> => {
          const dueCount = await writingModel.getDueCount(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            ['Uncategorized']
          );

          const expectedResult = vocabularyList.filter(
            (vocabulary): boolean => {
              return (
                vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                (typeof vocabulary.category === 'undefined' ||
                  vocabulary.category.categoryName === 'Uncategorized') &&
                typeof vocabulary.writing !== 'undefined' &&
                vocabulary.writing.disabled === false &&
                vocabulary.writing.lastWrittenAt !== null &&
                new WritingScheduler().calculateReviewTime(
                  initialInterval,
                  vocabulary.writing.level,
                  vocabulary.writing.lastWrittenAt
                ) < moment().toDate()
              );
            }
          ).length;

          expect(dueCount).toEqual(expectedResult);
        });

        test('get new count by category names', async (): Promise<void> => {
          const newCountPerCategoryNames = await writingModel.getNewCountByCategoryNames(
            userDb,
            setList[0].setId,
            ['Uncategorized', 'category1', 'animals']
          );

          expect(newCountPerCategoryNames).toEqual({
            Uncategorized: 3,
            category1: 1,
            animals: 0,
          });
        });

        test('get due count by category names', async (): Promise<void> => {
          const dueCountPerCategoryNames = await writingModel.getDueCountByCategoryNames(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            ['Uncategorized', 'category1', 'animals']
          );

          expect(dueCountPerCategoryNames).toEqual({
            Uncategorized: 2,
            category1: 1,
            animals: 0,
          });
        });
      });
    });
  });
});
