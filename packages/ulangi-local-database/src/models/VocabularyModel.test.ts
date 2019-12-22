/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Definition, Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEvent } from '../enums/DatabaseEvent';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyVocabularyModel } from './DirtyVocabularyModel';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('VocabularyModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let mockedDatabaseEventBus: jest.Mocked<DatabaseEventBus>;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let vocabularyModel: VocabularyModel;
    let dirtyVocabularyModel: DirtyVocabularyModel;
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
        dirtyVocabularyModel = modelFactory.createModel('dirtyVocabularyModel');

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

      test('local insert vocabulary into database successfully', async (): Promise<
        void
      > => {
        const vocabulary = new VocabularyBuilder().build({
          vocabularyStatus: VocabularyStatus.ACTIVE,
          vocabularyText: 'vocabularyText',
          level: 5,
          lastLearnedAt: moment().toDate(),
          createdAt: moment().toDate(),
          updatedAt: moment().toDate(),
          updatedStatusAt: moment().toDate(),
        });

        await userDb.transaction(
          (tx): void => {
            vocabularyModel.insertVocabulary(
              tx,
              vocabulary,
              setList[0].setId,
              'local'
            );
          }
        );

        const { vocabulary: fetchedVocabulary } = assertExists(
          await vocabularyModel.getVocabularyById(
            userDb,
            vocabulary.vocabularyId,
            true
          )
        );

        expect(fetchedVocabulary).toEqual(vocabulary);
        expect(mockedDatabaseEventBus.publish).toHaveBeenCalledWith(
          DatabaseEvent.VOCABULARY_INSERTED_FROM_LOCAL
        );
        expect(mockedDatabaseEventBus.publish).toHaveBeenCalledTimes(1);
      });

      test('local insert multiple vocabulary into database successfully', async (): Promise<
        void
      > => {
        const vocabularyList = Array(4)
          .fill(null)
          .map(
            (_, index): Vocabulary => {
              return new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary' + index,
                level: 6,
                lastLearnedAt: moment().toDate(),
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
                updatedStatusAt: moment().toDate(),
              });
            }
          );

        await userDb.transaction(
          (tx): void => {
            vocabularyModel.insertMultipleVocabulary(
              tx,
              vocabularyList.map(
                (vocabulary, index): [Vocabulary, string] => [
                  vocabulary,
                  setList[index % setList.length].setId,
                ]
              ),
              'local'
            );
          }
        );

        for (const vocabulary of vocabularyList) {
          const { vocabulary: fetchedVocabulary } = assertExists(
            await vocabularyModel.getVocabularyById(
              userDb,
              vocabulary.vocabularyId,
              true
            )
          );

          expect(fetchedVocabulary).toEqual(vocabulary);
        }

        expect(mockedDatabaseEventBus.publish).toHaveBeenCalledWith(
          DatabaseEvent.VOCABULARY_INSERTED_FROM_LOCAL
        );
        expect(mockedDatabaseEventBus.publish).toHaveBeenCalledTimes(1);
      });

      test('local insert vocabulary into database failed if setId is missing (failed foreign key constraints)', async (): Promise<
        void
      > => {
        const vocabulary = new VocabularyBuilder().build({
          vocabularyId: 'vocabularyId',
          vocabularyText: 'vocabularyText',
        });

        await expect(
          userDb.transaction(
            (tx): void => {
              vocabularyModel.insertVocabulary(
                tx,
                vocabulary,
                'unexisting set',
                'local'
              );
            }
          )
        ).rejects.toThrow();
      });

      test('local insert vocabulary list into database successfully', async (): Promise<
        void
      > => {
        const vocabularyList = Array(4)
          .fill(null)
          .map(
            (_, index): Vocabulary => {
              return new VocabularyBuilder().build({
                vocabularyText: 'new vocabulary' + index,
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
                  level: 5,
                  lastWrittenAt: moment().toDate(),
                  disabled: true,
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

        for (const vocabulary of vocabularyList) {
          const { vocabulary: fetchedVocabulary } = assertExists(
            await vocabularyModel.getVocabularyById(
              userDb,
              vocabulary.vocabularyId,
              true
            )
          );

          expect(fetchedVocabulary).toEqual(vocabulary);
        }

        expect(mockedDatabaseEventBus.publish).toHaveBeenCalledWith(
          DatabaseEvent.VOCABULARY_INSERTED_FROM_LOCAL
        );
        expect(mockedDatabaseEventBus.publish).toHaveBeenCalledTimes(1);
      });

      describe('Tests start after inserting some vocabulary with definitions, category and writing from local', (): void => {
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
                      level: index,
                      disabled: true,
                      lastWrittenAt: moment().toDate(),
                    },
                  });
                }
              );

            await userDb.transaction(
              (tx): void => {
                vocabularyModel.insertMultipleVocabulary(
                  tx,
                  vocabularyList.map(
                    (vocabulary, index): [Vocabulary, string] => [
                      vocabulary,
                      setList[index % setList.length].setId,
                    ]
                  ),
                  'local'
                );
              }
            );

            jest.clearAllMocks();
          }
        );

        test('get vocabulary list by vocabularyStatus without categoryName', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await vocabularyModel.getVocabularyList(
            userDb,
            setList[0].setId,
            VocabularyStatus.ACTIVE,
            undefined,
            10,
            0,
            true
          );

          expect(fetchedVocabularyList).toIncludeSameMembers(
            vocabularyList.filter(
              (_, index): boolean => index % setList.length === 0
            )
          );
        });

        test('get vocabulary list by vocabularyStatus and categoryName', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyList,
          } = await vocabularyModel.getVocabularyList(
            userDb,
            setList[0].setId,
            VocabularyStatus.ACTIVE,
            ['category0'],
            10,
            0,
            true
          );

          expect(fetchedVocabularyList).toEqual(
            vocabularyList.filter(
              (vocabulary, index): boolean => {
                return (
                  index % setList.length === 0 &&
                  typeof vocabulary.category !== 'undefined' &&
                  vocabulary.category.categoryName === 'category0'
                );
              }
            )
          );
        });

        test('local insert should mark records as dirty', async (): Promise<
          void
        > => {
          const {
            vocabularyList: dirtyVocabularyList,
          } = await dirtyVocabularyModel.getDirtyVocabularyListForSyncing(
            userDb,
            10,
            true
          );

          expect(dirtyVocabularyList).toIncludeSameMembers(
            vocabularyList.slice()
          );
        });

        test('local update should overwrite dirty fields', async (): Promise<
          void
        > => {
          await userDb.transaction(
            (tx): void => {
              vocabularyModel.updateMultipleVocabulary(
                tx,
                vocabularyList.map(
                  (
                    vocabulary
                  ): [DeepPartial<Vocabulary>, undefined | string] => {
                    return [
                      {
                        vocabularyId: vocabulary.vocabularyId,
                        vocabularyText: 'edited ' + vocabulary.vocabularyText,
                        definitions: vocabulary.definitions.map(
                          (definition): DeepPartial<Definition> => {
                            return {
                              definitionId: definition.definitionId,
                              meaning: 'edited ' + definition.meaning,
                            };
                          }
                        ),
                        category: {
                          categoryName: 'edited category',
                        },
                        writing: {
                          level: 8,
                        },
                      },
                      undefined,
                    ];
                  }
                ),
                'local'
              );
            }
          );

          const {
            vocabularyList: dirtyVocabularyList,
          } = await dirtyVocabularyModel.getDirtyVocabularyListForSyncing(
            userDb,
            10,
            true
          );

          expect(dirtyVocabularyList).toIncludeSameMembers(
            vocabularyList.map(
              (vocabulary): DeepPartial<Vocabulary> => {
                return {
                  ...vocabulary,
                  vocabularyText: 'edited ' + vocabulary.vocabularyText,
                  updatedAt: moment().toDate(),
                  definitions: vocabulary.definitions.map(
                    (definition): Definition => {
                      return {
                        ...definition,
                        meaning: 'edited ' + definition.meaning,
                        updatedAt: moment().toDate(),
                      };
                    }
                  ),
                  category: {
                    ...vocabulary.category,
                    categoryName: 'edited category',
                    updatedAt: moment().toDate(),
                  },
                  writing: {
                    ...vocabulary.writing,
                    level: 8,
                    updatedAt: moment().toDate(),
                  },
                };
              }
            )
          );
        });
      });

      describe('Tests start after inserting some uncategorized vocabulary from local', (): void => {
        let vocabularyList: Vocabulary[];

        let restoreCurrentTime: () => void;
        beforeEach(
          async (): Promise<void> => {
            restoreCurrentTime = mockCurrentTime();
            vocabularyList = Array(6)
              .fill(null)
              .map(
                (_, index): Vocabulary => {
                  return new VocabularyBuilder().build({
                    vocabularyText: 'vocabularyText' + index,
                    vocabularyStatus: VocabularyStatus.ACTIVE,
                    category:
                      index % 2 === 0
                        ? undefined
                        : {
                            categoryName: 'Uncategorized',
                          },
                  });
                }
              );

            await userDb.transaction(
              (tx): void => {
                vocabularyModel.insertMultipleVocabulary(
                  tx,
                  vocabularyList.map(
                    (vocabulary, index): [Vocabulary, string] => [
                      vocabulary,
                      setList[index % setList.length].setId,
                    ]
                  ),
                  'local'
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

        test('get uncategorized vocabulary list by status', async (): Promise<
          void
        > => {
          const {
            vocabularyList: fetchedVocabularyListWithUncategorized,
          } = await vocabularyModel.getVocabularyList(
            userDb,
            setList[0].setId,
            VocabularyStatus.ACTIVE,
            ['Uncategorized'],
            10,
            0,
            true
          );

          expect(fetchedVocabularyListWithUncategorized).toIncludeSameMembers(
            vocabularyList.filter((vocabulary): boolean => !vocabulary.category)
          );
        });
      });

      describe('Tests start after inserting some vocabulary with definitions and category from remote', (): void => {
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
                  });
                }
              );

            await userDb.transaction(
              (tx): void => {
                vocabularyModel.insertMultipleVocabulary(
                  tx,
                  vocabularyList.map(
                    (vocabulary, index): [Vocabulary, string] => [
                      vocabulary,
                      setList[index % setList.length].setId,
                    ]
                  ),
                  'remote'
                );
              }
            );

            jest.clearAllMocks();
          }
        );

        test('remote insert should not mark records as dirty', async (): Promise<
          void
        > => {
          const {
            vocabularyList: dirtyVocabularyList,
          } = await dirtyVocabularyModel.getDirtyVocabularyListForSyncing(
            userDb,
            10,
            true
          );

          expect(dirtyVocabularyList).toEqual([]);
        });

        test('remote update should overwrite only clean fields', async (): Promise<
          void
        > => {
          await userDb.transaction(
            (tx): void => {
              vocabularyModel.updateMultipleVocabulary(
                tx,
                vocabularyList.map(
                  (
                    vocabulary
                  ): [DeepPartial<Vocabulary>, string | undefined] => {
                    return [
                      {
                        vocabularyId: vocabulary.vocabularyId,
                        vocabularyText:
                          'first edited' + vocabulary.vocabularyText,
                      },
                      undefined,
                    ];
                  }
                ),
                'local'
              );
            }
          );

          // Below query should only update vocabularyStatus
          await userDb.transaction(
            (tx): void => {
              vocabularyModel.updateMultipleVocabulary(
                tx,
                vocabularyList.map(
                  (
                    vocabulary
                  ): [DeepPartial<Vocabulary>, string | undefined] => {
                    return [
                      {
                        vocabularyId: vocabulary.vocabularyId,
                        vocabularyText:
                          'second edited ' + vocabulary.vocabularyText,
                        vocabularyStatus: VocabularyStatus.ARCHIVED,
                      },
                      undefined,
                    ];
                  }
                ),
                'remote'
              );
            }
          );

          for (const vocabulary of vocabularyList) {
            const { vocabulary: fetchedVocabulary } = assertExists(
              await vocabularyModel.getVocabularyById(
                userDb,
                vocabulary.vocabularyId,
                true
              )
            );

            expect(fetchedVocabulary).toEqual({
              ...vocabulary,
              vocabularyText: 'first edited' + vocabulary.vocabularyText,
              vocabularyStatus: VocabularyStatus.ARCHIVED,
            });
          }
        });
      });
    });
  });
});
