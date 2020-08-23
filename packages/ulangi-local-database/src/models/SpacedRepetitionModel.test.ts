/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { SpacedRepetitionScheduler } from '@ulangi/ulangi-common/core';
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
import { SpacedRepetitionModel } from './SpacedRepetitionModel';
import { VocabularyModel } from './VocabularyModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('SpacedRepetitionModel', (): void => {
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
    let spacedRepetitionModel: SpacedRepetitionModel;
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
        spacedRepetitionModel = modelFactory.createModel(
          'spacedRepetitionModel'
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

      describe('Tests start after inserting terms from local', (): void => {
        let vocabularyList: Vocabulary[];

        beforeEach(
          async (): Promise<void> => {
            const new_terms = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                lastLearnedAt: null,
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ARCHIVED,
                vocabularyText: 'vocabulary',
                lastLearnedAt: null,
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.DELETED,
                vocabularyText: 'vocabulary',
                lastLearnedAt: null,
              }),
            ];

            const new_terms_with_category = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                lastLearnedAt: null,
                category: {
                  categoryName: 'Uncategorized',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                lastLearnedAt: null,
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                lastLearnedAt: null,
                category: {
                  categoryName: 'category2',
                },
              }),
            ];

            const learned_terms = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 0,
                lastLearnedAt: moment()
                  .subtract(1, 'hours')
                  .toDate(),
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                lastLearnedAt: moment()
                  .subtract(initialInterval + 1, 'hours')
                  .toDate(),
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                lastLearnedAt: moment()
                  .subtract(initialInterval - 1, 'hours')
                  .toDate(),
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                lastLearnedAt: moment().toDate(),
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.DELETED,
                vocabularyText: 'vocabulary',
                level: 1,
                lastLearnedAt: moment()
                  .subtract(initialInterval + 1, 'hours')
                  .toDate(),
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 2,
                lastLearnedAt: moment()
                  .subtract(initialInterval * 2 + 1, 'hours')
                  .toDate(),
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 2,
                lastLearnedAt: moment()
                  .subtract(initialInterval * 2 - 1, 'hours')
                  .toDate(),
              }),
            ];

            const learned_terms_with_category = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 0,
                lastLearnedAt: moment()
                  .subtract(1, 'hours')
                  .toDate(),
                category: {
                  categoryName: 'Uncategorized',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 0,
                lastLearnedAt: moment()
                  .subtract(1, 'hours')
                  .toDate(),
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                lastLearnedAt: moment()
                  .subtract(initialInterval + 1, 'hours')
                  .toDate(),
                category: {
                  categoryName: 'Uncategorized',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                lastLearnedAt: moment()
                  .subtract(initialInterval + 1, 'hours')
                  .toDate(),
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                lastLearnedAt: moment()
                  .subtract(initialInterval - 1, 'hours')
                  .toDate(),
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                category: {
                  categoryName: 'category2',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 2,
                lastLearnedAt: moment()
                  .subtract(initialInterval * 2 + 1, 'hours')
                  .toDate(),
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 2,
                lastLearnedAt: moment()
                  .subtract(initialInterval * 2 - 1, 'hours')
                  .toDate(),
                category: {
                  categoryName: 'category1',
                },
              }),
            ];

            vocabularyList = [
              ...new_terms,
              ...learned_terms,
              ...new_terms_with_category,
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
          } = await spacedRepetitionModel.getVocabularyListByLevel(
            userDb,
            setList[0].setId,
            undefined,
            initialInterval,
            limit,
            true,
            undefined,
            undefined
          );

          expect(fetchedVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  vocabulary.lastLearnedAt === null
                );
              }
            )
          );
        });

        test('get new vocabulary with selected categories ', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await spacedRepetitionModel.getVocabularyListByLevel(
            userDb,
            setList[0].setId,
            undefined,
            initialInterval,
            limit,
            true,
            ['category1'],
            undefined
          );

          expect(fetchedVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  vocabulary.lastLearnedAt === null &&
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
          } = await spacedRepetitionModel.getVocabularyListByLevel(
            userDb,
            setList[0].setId,
            undefined,
            initialInterval,
            limit,
            true,
            ['Uncategorized'],
            undefined
          );

          expect(fetchedVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  vocabulary.lastLearnedAt === null &&
                  (typeof vocabulary.category === 'undefined' ||
                    vocabulary.category.categoryName === 'Uncategorized')
                );
              }
            )
          );
        });

        test('get new vocabulary list by level with excluded categories', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyListByCategoryName,
          } = await spacedRepetitionModel.getVocabularyListByLevel(
            userDb,
            setList[0].setId,
            undefined,
            initialInterval,
            limit,
            true,
            undefined,
            ['category2']
          );

          expect(fetchedVocabularyListByCategoryName).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  vocabulary.lastLearnedAt === null &&
                  (typeof vocabulary.category === 'undefined' ||
                    vocabulary.category.categoryName !== 'category2')
                );
              }
            )
          );
        });

        test('get new vocabulary excluding Uncategorized', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyListByCategoryName,
          } = await spacedRepetitionModel.getVocabularyListByLevel(
            userDb,
            setList[0].setId,
            undefined,
            initialInterval,
            limit,
            true,
            undefined,
            ['Uncategorized']
          );

          expect(fetchedVocabularyListByCategoryName).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  vocabulary.lastLearnedAt === null &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName !== 'Uncategorized'
                );
              }
            )
          );
        });

        describe('Test get level 0, 1, 2 vocabulary', (): void => {
          const levels = [0, 1, 2];

          for (const level of levels) {
            test(`get level ${level} vocabulary`, async (): Promise<void> => {
              const {
                vocabularyList: fetchedVocabularyList,
              } = await spacedRepetitionModel.getVocabularyListByLevel(
                userDb,
                setList[0].setId,
                level,
                initialInterval,
                limit,
                true,
                undefined,
                undefined
              );

              expect(fetchedVocabularyList).toIncludeSameMembers(
                vocabularyList.filter(
                  (vocabulary): boolean => {
                    return (
                      vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                      vocabulary.level === level &&
                      (vocabulary.lastLearnedAt !== null &&
                        vocabulary.lastLearnedAt <
                          moment()
                            .subtract(
                              level === 0
                                ? 0
                                : initialInterval * Math.pow(2, level - 1),
                              'hours'
                            )
                            .toDate())
                    );
                  }
                )
              );
            });

            test(`get level ${level} vocabulary with selected categories`, async (): Promise<
              void
            > => {
              const {
                vocabularyList: fetchedVocabularyListByCategoryName,
              } = await spacedRepetitionModel.getVocabularyListByLevel(
                userDb,
                setList[0].setId,
                level,
                initialInterval,
                limit,
                true,
                ['category1'],
                undefined
              );

              expect(fetchedVocabularyListByCategoryName).toIncludeSameMembers(
                vocabularyList.filter(
                  (vocabulary): boolean => {
                    return (
                      vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                      vocabulary.level === level &&
                      (vocabulary.lastLearnedAt !== null &&
                        vocabulary.lastLearnedAt <
                          moment()
                            .subtract(
                              level === 0
                                ? 0
                                : initialInterval * Math.pow(2, level - 1),
                              'hours'
                            )
                            .toDate()) &&
                      typeof vocabulary.category !== 'undefined' &&
                      vocabulary.category.categoryName === 'category1'
                    );
                  }
                )
              );
            });

            test(`get level ${level} vocabulary with Uncategorized`, async (): Promise<
              void
            > => {
              const {
                vocabularyList: fetchedVocabularyListByCategoryName,
              } = await spacedRepetitionModel.getVocabularyListByLevel(
                userDb,
                setList[0].setId,
                level,
                initialInterval,
                limit,
                true,
                ['Uncategorized'],
                undefined
              );

              expect(fetchedVocabularyListByCategoryName).toIncludeSameMembers(
                vocabularyList.filter(
                  (vocabulary): boolean => {
                    return (
                      vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                      vocabulary.level === level &&
                      (vocabulary.lastLearnedAt !== null &&
                        vocabulary.lastLearnedAt <
                          moment()
                            .subtract(
                              level === 0
                                ? 0
                                : initialInterval * Math.pow(2, level - 1),
                              'hours'
                            )
                            .toDate()) &&
                      (typeof vocabulary.category === 'undefined' ||
                        vocabulary.category.categoryName === 'Uncategorized')
                    );
                  }
                )
              );
            });

            test(`get level ${level} vocabulary with excluded categories`, async (): Promise<
              void
            > => {
              const {
                vocabularyList: fetchedVocabularyListByCategoryName,
              } = await spacedRepetitionModel.getVocabularyListByLevel(
                userDb,
                setList[0].setId,
                level,
                initialInterval,
                limit,
                true,
                undefined,
                ['category2']
              );

              expect(fetchedVocabularyListByCategoryName).toIncludeSameMembers(
                vocabularyList.filter(
                  (vocabulary): boolean => {
                    return (
                      vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                      vocabulary.level === level &&
                      (vocabulary.lastLearnedAt !== null &&
                        vocabulary.lastLearnedAt <
                          moment()
                            .subtract(
                              level === 0
                                ? 0
                                : initialInterval * Math.pow(2, level - 1),
                              'hours'
                            )
                            .toDate()) &&
                      (typeof vocabulary.category === 'undefined' ||
                        vocabulary.category.categoryName !== 'category2')
                    );
                  }
                )
              );
            });

            test(`get level ${level} vocabulary excluding Uncategorized`, async (): Promise<
              void
            > => {
              const {
                vocabularyList: fetchedVocabularyListByCategoryName,
              } = await spacedRepetitionModel.getVocabularyListByLevel(
                userDb,
                setList[0].setId,
                level,
                initialInterval,
                limit,
                true,
                undefined,
                ['Uncategorized']
              );

              expect(fetchedVocabularyListByCategoryName).toIncludeSameMembers(
                vocabularyList.filter(
                  (vocabulary): boolean => {
                    return (
                      vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                      vocabulary.level === level &&
                      (vocabulary.lastLearnedAt !== null &&
                        vocabulary.lastLearnedAt <
                          moment()
                            .subtract(
                              level === 0
                                ? 0
                                : initialInterval * Math.pow(2, level - 1),
                              'hours'
                            )
                            .toDate()) &&
                      typeof vocabulary.category !== 'undefined' &&
                      vocabulary.category.categoryName !== 'Uncategorized'
                    );
                  }
                )
              );
            });
          }
        });

        test('get new vocabulary list (all categories)', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await spacedRepetitionModel.getNewVocabularyList(
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
                  vocabulary.lastLearnedAt === null
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
          } = await spacedRepetitionModel.getNewVocabularyList(
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
                  vocabulary.lastLearnedAt === null &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName === 'category1'
                );
              }
            )
          );
        });

        test('get new vocabulary in Uncategorized category', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await spacedRepetitionModel.getNewVocabularyList(
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
                  vocabulary.lastLearnedAt === null &&
                  (typeof vocabulary.category === 'undefined' ||
                    vocabulary.category.categoryName === 'Uncategorized')
                );
              }
            )
          );
        });

        test('get due vocabulary list (all categories)', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedDueVocabularyList,
          } = await spacedRepetitionModel.getDueVocabularyList(
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
                  (vocabulary.lastLearnedAt !== null &&
                    new SpacedRepetitionScheduler().calculateReviewTime(
                      initialInterval,
                      vocabulary.level,
                      vocabulary.lastLearnedAt
                    ) < moment().toDate())
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
          } = await spacedRepetitionModel.getDueVocabularyList(
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
                  (vocabulary.lastLearnedAt !== null &&
                    new SpacedRepetitionScheduler().calculateReviewTime(
                      initialInterval,
                      vocabulary.level,
                      vocabulary.lastLearnedAt
                    ) < moment().toDate())
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
          } = await spacedRepetitionModel.getDueVocabularyList(
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
                (vocabulary.lastLearnedAt !== null &&
                  new SpacedRepetitionScheduler().calculateReviewTime(
                    initialInterval,
                    vocabulary.level,
                    vocabulary.lastLearnedAt
                  ) < moment().toDate())
              );
            }
          );

          expect(
            fetchedDueVocabularyListWithUncategorized
          ).toIncludeSameMembers(expectedResult);
        });

        test('get new count (all categories)', async (): Promise<void> => {
          const newCount = await spacedRepetitionModel.getNewCount(
            userDb,
            setList[0].setId,
            undefined
          );

          expect(newCount).toEqual(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  vocabulary.lastLearnedAt === null
                );
              }
            ).length
          );
        });

        test('get new count with selected categories ', async (): Promise<
          void
        > => {
          const newCount = await spacedRepetitionModel.getNewCount(
            userDb,
            setList[0].setId,
            ['category1']
          );

          expect(newCount).toEqual(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  vocabulary.lastLearnedAt === null &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName === 'category1'
                );
              }
            ).length
          );
        });

        test('get new count of Uncategorized category', async (): Promise<
          void
        > => {
          const newCount = await spacedRepetitionModel.getNewCount(
            userDb,
            setList[0].setId,
            ['Uncategorized']
          );

          expect(newCount).toEqual(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  vocabulary.lastLearnedAt === null &&
                  (typeof vocabulary.category === 'undefined' ||
                    vocabulary.category.categoryName === 'Uncategorized')
                );
              }
            ).length
          );
        });

        test('get due count (all categories)', async (): Promise<void> => {
          const dueCount = await spacedRepetitionModel.getDueCount(
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
                  (vocabulary.lastLearnedAt !== null &&
                    new SpacedRepetitionScheduler().calculateReviewTime(
                      initialInterval,
                      vocabulary.level,
                      vocabulary.lastLearnedAt
                    ) < moment().toDate())
                );
              }
            ).length
          );
        });

        test('get due count with category1', async (): Promise<void> => {
          const dueCount = await spacedRepetitionModel.getDueCount(
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
                  (vocabulary.lastLearnedAt !== null &&
                    new SpacedRepetitionScheduler().calculateReviewTime(
                      initialInterval,
                      vocabulary.level,
                      vocabulary.lastLearnedAt
                    ) < moment().toDate())
                );
              }
            ).length
          );
        });

        test('get due count with Uncategorized', async (): Promise<void> => {
          const dueCount = await spacedRepetitionModel.getDueCount(
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
                (vocabulary.lastLearnedAt !== null &&
                  new SpacedRepetitionScheduler().calculateReviewTime(
                    initialInterval,
                    vocabulary.level,
                    vocabulary.lastLearnedAt
                  ) < moment().toDate())
              );
            }
          ).length;

          expect(dueCount).toEqual(expectedResult);
        });

        test('get new count by categories', async (): Promise<void> => {
          const newCountPerCategoryNames = await spacedRepetitionModel.getNewCountByCategoryNames(
            userDb,
            setList[0].setId,
            ['Uncategorized', 'category1', 'animals']
          );

          expect(newCountPerCategoryNames).toEqual({
            Uncategorized: 2,
            category1: 1,
            animals: 0,
          });
        });

        test('get due count by categories', async (): Promise<void> => {
          const dueCountPerCategoryNames = await spacedRepetitionModel.getDueCountByCategoryNames(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            ['Uncategorized', 'category1', 'animals']
          );

          expect(dueCountPerCategoryNames).toEqual({
            Uncategorized: 5,
            category1: 3,
            animals: 0,
          });
        });
      });
    });
  });
});
