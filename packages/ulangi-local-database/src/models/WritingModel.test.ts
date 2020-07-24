/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { WritingScheduler } from '@ulangi/ulangi-common/core';
import {
  CategorySortType,
  VocabularySortType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Category, Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as _ from 'lodash';
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
            const level_0_terms = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 0,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 0,
                  disabled: true,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ARCHIVED,
                vocabularyText: 'vocabulary',
              }),
            ];

            const level_0_terms_with_category = [
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
                  level: 0,
                },
                category: {
                  categoryName: 'category2',
                },
              }),
            ];

            const level_gt_0_terms = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: null,
                },
              }),
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
                  lastWrittenAt: null,
                  disabled: true,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.DELETED,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: null,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ARCHIVED,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: null,
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

            const level_gt_0_terms_with_category = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                writing: {
                  level: 1,
                  lastWrittenAt: null,
                },
                category: {
                  categoryName: 'category',
                },
              }),
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
                  categoryName: 'category',
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
                  categoryName: 'category',
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
                  categoryName: 'category',
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
                  categoryName: 'category',
                },
              }),
            ];

            vocabularyList = [
              ...level_0_terms,
              ...level_0_terms_with_category,
              ...level_gt_0_terms,
              ...level_gt_0_terms_with_category,
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

        test('get due level 0 vocabulary', async (): Promise<void> => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await writingModel.getDueVocabularyListByLevel(
            userDb,
            setList[0].setId,
            0,
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
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.level === 0 &&
                      vocabulary.writing.disabled === false))
                );
              }
            )
          );
        });

        test('get due level 0 vocabulary with selected categories', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await writingModel.getDueVocabularyListByLevel(
            userDb,
            setList[0].setId,
            0,
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
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.level === 0 &&
                      vocabulary.writing.disabled === false)) &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName === 'category1'
                );
              }
            )
          );
        });

        test('get due level 0 vocabulary with Uncategorized', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await writingModel.getDueVocabularyListByLevel(
            userDb,
            setList[0].setId,
            0,
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
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.level === 0 &&
                      vocabulary.writing.disabled === false)) &&
                  (typeof vocabulary.category === 'undefined' ||
                    vocabulary.category.categoryName === 'Uncategorized')
                );
              }
            )
          );
        });

        test('get level 0 due vocabulary with excluded categories', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await writingModel.getDueVocabularyListByLevel(
            userDb,
            setList[0].setId,
            0,
            initialInterval,
            limit,
            true,
            undefined,
            ['category2']
          );

          expect(fetchedVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.level === 0 &&
                      vocabulary.writing.disabled === false)) &&
                  (typeof vocabulary.category === 'undefined' ||
                    vocabulary.category.categoryName !== 'category2')
                );
              }
            )
          );
        });

        test('get level 0 due vocabulary excluding Uncategorized', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await writingModel.getDueVocabularyListByLevel(
            userDb,
            setList[0].setId,
            0,
            initialInterval,
            limit,
            true,
            undefined,
            ['Uncategorized']
          );

          expect(fetchedVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.level === 0 &&
                      vocabulary.writing.disabled === false)) &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName !== 'Uncategorized'
                );
              }
            )
          );
        });

        describe('Test get level 1 & 2 due vocabulary', (): void => {
          const levels = [1, 2];

          for (const level of levels) {
            test(`get level ${level} due vocabulary`, async (): Promise<
              void
            > => {
              const {
                vocabularyList: fetchedVocabularyList,
              } = await writingModel.getDueVocabularyListByLevel(
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
                      typeof vocabulary.writing !== 'undefined' &&
                      vocabulary.writing.disabled === false &&
                      vocabulary.writing.level === level &&
                      (vocabulary.writing.lastWrittenAt === null ||
                        vocabulary.writing.lastWrittenAt <
                          moment()
                            .subtract(
                              initialInterval * Math.pow(2, level - 1),
                              'hours'
                            )
                            .toDate())
                    );
                  }
                )
              );
            });

            test(`get level ${level} due vocabulary with selected categories`, async (): Promise<
              void
            > => {
              const {
                vocabularyList: fetchedVocabularyList,
              } = await writingModel.getDueVocabularyListByLevel(
                userDb,
                setList[0].setId,
                level,
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
                      typeof vocabulary.writing !== 'undefined' &&
                      vocabulary.writing.disabled === false &&
                      vocabulary.writing.level === level &&
                      (vocabulary.writing.lastWrittenAt === null ||
                        vocabulary.writing.lastWrittenAt <
                          moment()
                            .subtract(
                              initialInterval * Math.pow(2, level - 1),
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

            test(`get level ${level} due vocabulary with Uncategorized`, async (): Promise<
              void
            > => {
              const {
                vocabularyList: fetchedVocabularyList,
              } = await writingModel.getDueVocabularyListByLevel(
                userDb,
                setList[0].setId,
                level,
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
                      typeof vocabulary.writing !== 'undefined' &&
                      vocabulary.writing.disabled === false &&
                      vocabulary.writing.level === level &&
                      (vocabulary.writing.lastWrittenAt === null ||
                        vocabulary.writing.lastWrittenAt <
                          moment()
                            .subtract(
                              initialInterval * Math.pow(2, level - 1),
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

            test(`get level ${level} due vocabulary with excluded categories`, async (): Promise<
              void
            > => {
              const {
                vocabularyList: fetchedVocabularyList,
              } = await writingModel.getDueVocabularyListByLevel(
                userDb,
                setList[0].setId,
                level,
                initialInterval,
                limit,
                true,
                undefined,
                ['category2']
              );

              expect(fetchedVocabularyList).toIncludeSameMembers(
                vocabularyList.filter(
                  (vocabulary): boolean => {
                    return (
                      vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                      typeof vocabulary.writing !== 'undefined' &&
                      vocabulary.writing.disabled === false &&
                      vocabulary.writing.level === level &&
                      (vocabulary.writing.lastWrittenAt === null ||
                        vocabulary.writing.lastWrittenAt <
                          moment()
                            .subtract(
                              initialInterval * Math.pow(2, level - 1),
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

            test(`get level ${level} due vocabulary excluding Uncategorized`, async (): Promise<
              void
            > => {
              const {
                vocabularyList: fetchedVocabularyList,
              } = await writingModel.getDueVocabularyListByLevel(
                userDb,
                setList[0].setId,
                level,
                initialInterval,
                limit,
                true,
                undefined,
                ['Uncategorized']
              );

              expect(fetchedVocabularyList).toIncludeSameMembers(
                vocabularyList.filter(
                  (vocabulary): boolean => {
                    return (
                      vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                      typeof vocabulary.writing !== 'undefined' &&
                      vocabulary.writing.disabled === false &&
                      vocabulary.writing.level === level &&
                      (vocabulary.writing.lastWrittenAt === null ||
                        vocabulary.writing.lastWrittenAt <
                          moment()
                            .subtract(
                              initialInterval * Math.pow(2, level - 1),
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
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.disabled === false &&
                      (vocabulary.writing.lastWrittenAt === null ||
                        new WritingScheduler().calculateReviewTime(
                          initialInterval,
                          vocabulary.writing.level,
                          vocabulary.writing.lastWrittenAt
                        ) < moment().toDate())))
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
                (typeof vocabulary.writing === 'undefined' ||
                  (vocabulary.writing.disabled === false &&
                    (vocabulary.writing.lastWrittenAt === null ||
                      new WritingScheduler().calculateReviewTime(
                        initialInterval,
                        vocabulary.writing.level,
                        vocabulary.writing.lastWrittenAt
                      ) < moment().toDate())))
              );
            }
          );

          expect(
            fetchedDueVocabularyListWithUncategorized
          ).toIncludeSameMembers(expectedResult);
        });

        test('get due vocabulary list without categoryName', async (): Promise<
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
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.disabled === false &&
                      (vocabulary.writing.lastWrittenAt === null ||
                        new WritingScheduler().calculateReviewTime(
                          initialInterval,
                          vocabulary.writing.level,
                          vocabulary.writing.lastWrittenAt
                        ) < moment().toDate())))
                );
              }
            )
          );
        });

        test('get due category list excluding Uncategorized', async (): Promise<
          void
        > => {
          const {
            categoryList: fetchedDueCategoryList,
          } = await writingModel.getDueCategoryList(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            CategorySortType.SORT_BY_NAME_ASC,
            limit,
            0,
            false
          );

          expect(fetchedDueCategoryList).toIncludeSameMembers(
            _.toPairs(
              _.groupBy(
                vocabularyList.filter(
                  (vocabulary): boolean => {
                    return (
                      vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                      typeof vocabulary.category !== 'undefined' &&
                      vocabulary.category.categoryName !== 'Uncategorized' &&
                      (typeof vocabulary.writing === 'undefined' ||
                        (vocabulary.writing.disabled === false &&
                          (vocabulary.writing.lastWrittenAt === null ||
                            new WritingScheduler().calculateReviewTime(
                              initialInterval,
                              vocabulary.writing.level,
                              vocabulary.writing.lastWrittenAt
                            ) < moment().toDate())))
                    );
                  }
                ),
                (vocabulary: Vocabulary): string => {
                  return assertExists(vocabulary.category).categoryName;
                }
              )
            ).map(
              (groupByCategoryName: [string, Vocabulary[]]): Category => {
                return {
                  categoryName: groupByCategoryName[0],
                  totalCount: groupByCategoryName[1].length,
                  srLevel0Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => vocabulary.level === 0
                  ).length,
                  srLevel1To3Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean =>
                      vocabulary.level >= 1 && vocabulary.level <= 3
                  ).length,
                  srLevel4To6Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean =>
                      vocabulary.level >= 4 && vocabulary.level <= 6
                  ).length,
                  srLevel7To8Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean =>
                      vocabulary.level >= 7 && vocabulary.level <= 8
                  ).length,
                  srLevel9To10Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean =>
                      vocabulary.level >= 9 && vocabulary.level <= 10
                  ).length,
                  wrLevel0Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing === 'undefined' ||
                        vocabulary.writing.level === 0
                      );
                    }
                  ).length,
                  wrLevel1To3Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing !== 'undefined' &&
                        vocabulary.writing.level >= 1 &&
                        vocabulary.writing.level <= 3
                      );
                    }
                  ).length,
                  wrLevel4To6Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing !== 'undefined' &&
                        vocabulary.writing.level >= 4 &&
                        vocabulary.writing.level <= 6
                      );
                    }
                  ).length,
                  wrLevel7To8Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing !== 'undefined' &&
                        vocabulary.writing.level >= 7 &&
                        vocabulary.writing.level <= 8
                      );
                    }
                  ).length,
                  wrLevel9To10Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing !== 'undefined' &&
                        vocabulary.writing.level >= 9 &&
                        vocabulary.writing.level <= 10
                      );
                    }
                  ).length,
                };
              }
            )
          );
        });

        test('get due category list including Uncategorized', async (): Promise<
          void
        > => {
          const {
            categoryList: fetchedDueCategoryList,
          } = await writingModel.getDueCategoryList(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel,
            CategorySortType.SORT_BY_NAME_ASC,
            limit,
            0,
            true
          );

          expect(fetchedDueCategoryList).toIncludeSameMembers(
            _.toPairs(
              _.groupBy(
                vocabularyList.filter(
                  (vocabulary): boolean => {
                    return (
                      vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                      (typeof vocabulary.writing === 'undefined' ||
                        (vocabulary.writing.disabled === false &&
                          (vocabulary.writing.lastWrittenAt === null ||
                            new WritingScheduler().calculateReviewTime(
                              initialInterval,
                              vocabulary.writing.level,
                              vocabulary.writing.lastWrittenAt
                            ) < moment().toDate())))
                    );
                  }
                ),
                (vocabulary: Vocabulary): string => {
                  return typeof vocabulary.category === 'undefined'
                    ? 'Uncategorized'
                    : vocabulary.category.categoryName;
                }
              )
            ).map(
              (groupByCategoryName: [string, Vocabulary[]]): Category => {
                return {
                  categoryName: groupByCategoryName[0],
                  totalCount: groupByCategoryName[1].length,
                  srLevel0Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => vocabulary.level === 0
                  ).length,
                  srLevel1To3Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean =>
                      vocabulary.level >= 1 && vocabulary.level <= 3
                  ).length,
                  srLevel4To6Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean =>
                      vocabulary.level >= 4 && vocabulary.level <= 6
                  ).length,
                  srLevel7To8Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean =>
                      vocabulary.level >= 7 && vocabulary.level <= 8
                  ).length,
                  srLevel9To10Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean =>
                      vocabulary.level >= 9 && vocabulary.level <= 10
                  ).length,
                  wrLevel0Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing === 'undefined' ||
                        vocabulary.writing.level === 0
                      );
                    }
                  ).length,
                  wrLevel1To3Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing !== 'undefined' &&
                        vocabulary.writing.level >= 1 &&
                        vocabulary.writing.level <= 3
                      );
                    }
                  ).length,
                  wrLevel4To6Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing !== 'undefined' &&
                        vocabulary.writing.level >= 4 &&
                        vocabulary.writing.level <= 6
                      );
                    }
                  ).length,
                  wrLevel7To8Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing !== 'undefined' &&
                        vocabulary.writing.level >= 7 &&
                        vocabulary.writing.level <= 8
                      );
                    }
                  ).length,
                  wrLevel9To10Count: groupByCategoryName[1].filter(
                    (vocabulary): boolean => {
                      return (
                        typeof vocabulary.writing !== 'undefined' &&
                        vocabulary.writing.level >= 9 &&
                        vocabulary.writing.level <= 10
                      );
                    }
                  ).length,
                };
              }
            )
          );
        });

        test('get Uncategorized due count', async (): Promise<void> => {
          const uncategorize = await writingModel.getUncategorizedDueCounts(
            userDb,
            setList[0].setId,
            initialInterval,
            maxLevel
          );

          expect(uncategorize.totalCount).toEqual(
            vocabularyList.filter(
              (vocabulary): boolean => {
                return (
                  vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
                  (typeof vocabulary.category === 'undefined' ||
                    vocabulary.category.categoryName === 'Uncategorized') &&
                  (typeof vocabulary.writing === 'undefined' ||
                    (vocabulary.writing.disabled === false &&
                      (vocabulary.writing.lastWrittenAt === null ||
                        new WritingScheduler().calculateReviewTime(
                          initialInterval,
                          vocabulary.writing.level,
                          vocabulary.writing.lastWrittenAt
                        ) < moment().toDate())))
                );
              }
            ).length
          );
        });
      });
    });
  });
});
