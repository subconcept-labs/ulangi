/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Definition, Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as knex from 'knex';
import * as moment from 'moment';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { SetModel } from '../models/SetModel';
import { VocabularyModel } from '../models/VocabularyModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('VocabularyModel', (): void => {
  const env = resolveEnv();

  let userId: string;
  let restoreCurrentTime: () => void;

  beforeEach(
    async (): Promise<void> => {
      userId = short.generate();
      restoreCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      restoreCurrentTime();
    }
  );

  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let shardDb: knex;
    let modelFactory: ModelFactory;
    let vocabularyModel: VocabularyModel;
    let setModel: SetModel;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(
          env.AUTH_DATABASE_CONFIG,
          env.ALL_SHARD_DATABASE_CONFIG,
          env.SHARD_DATABASE_NAME_PREFIX
        );
        await databaseFacade.checkAllShardDatabaseTables();
        shardDb = databaseFacade.getDb(
          env.ALL_SHARD_DATABASE_CONFIG[0].shardId
        );

        modelFactory = new ModelFactory();
        setModel = modelFactory.createModel('setModel');
        vocabularyModel = modelFactory.createModel('vocabularyModel');
      }
    );

    afterEach(
      async (): Promise<void> => {
        await databaseFacade.closeAllDatabases();
      }
    );

    describe('Tests start after inserting sets into database', (): void => {
      let setList: readonly Set[];
      beforeEach(
        async (): Promise<void> => {
          setList = Array(2)
            .fill(null)
            .map(
              (_, index): Set => {
                return new SetBuilder().build({
                  setName: 'set' + index,
                  learningLanguageCode: 'en',
                  translatedToLanguageCode: 'en',
                });
              }
            );

          await shardDb.transaction(
            async (tx): Promise<void[]> => {
              return Promise.all([setModel.upsertSets(tx, userId, setList)]);
            }
          );
        }
      );

      test('insert vocabulary list successfully', async (): Promise<void> => {
        const vocabularySetIdPairs = Array(4)
          .fill(null)
          .map(
            (): [Vocabulary, string] => {
              return [
                new VocabularyBuilder().build({ vocabularyText: 'test' }),
                setList[0].setId,
              ];
            }
          );

        await shardDb.transaction(
          async (tx): Promise<void> => {
            return vocabularyModel.upsertMultipleVocabulary(
              tx,
              userId,
              vocabularySetIdPairs
            );
          }
        );

        const {
          vocabularyList,
          vocabularyIdSetIdPairs,
        } = await vocabularyModel.getVocabularyByIds(
          shardDb,
          userId,
          vocabularySetIdPairs.map(
            ([vocabulary]): string => vocabulary.vocabularyId
          ),
          true
        );

        expect(vocabularyList).toIncludeSameMembers(
          vocabularySetIdPairs.map(
            ([vocabulary]): Vocabulary => {
              return {
                ...vocabulary,
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              };
            }
          )
        );

        expect(vocabularyIdSetIdPairs).toIncludeSameMembers(
          vocabularySetIdPairs.map(
            ([vocabulary, setId]): [string, string] => {
              return [vocabulary.vocabularyId, setId];
            }
          )
        );
      });

      describe('Tests start after inserting some vocabulary into database', (): void => {
        let vocabularySetIdPairs: readonly [Vocabulary, string][];

        beforeEach(
          async (): Promise<void> => {
            vocabularySetIdPairs = Array(4)
              .fill(null)
              .map(
                (_, index): [Vocabulary, string] => {
                  return [
                    new VocabularyBuilder().build({
                      vocabularyText: 'vocabulary' + index,
                      definitions: [
                        {
                          meaning: 'meaning' + index,
                          source: 'source',
                        },
                      ],
                      category: {
                        categoryName: 'categoryName' + index,
                      },
                      writing: {
                        level: index,
                      },
                    }),
                    setList[index % setList.length].setId,
                  ];
                }
              );

            await shardDb.transaction(
              async (tx): Promise<void[]> => {
                return Promise.all([
                  vocabularyModel.upsertMultipleVocabulary(
                    tx,
                    userId,
                    vocabularySetIdPairs
                  ),
                ]);
              }
            );
          }
        );

        test('get vocabulary list by ids', async (): Promise<void> => {
          const {
            vocabularyList,
            vocabularyIdSetIdPairs,
          } = await vocabularyModel.getVocabularyByIds(
            shardDb,
            userId,
            vocabularySetIdPairs.map(
              ([vocabulary]): string => vocabulary.vocabularyId
            ),
            true
          );

          expect(vocabularyList).toIncludeSameMembers(
            vocabularyList.map(
              (vocabulary): Vocabulary => {
                return {
                  ...vocabulary,
                  definitions: expect.toIncludeSameMembers(
                    vocabulary.definitions.map(
                      (definition): Definition => {
                        return {
                          ...definition,
                          firstSyncedAt: expect.any(Date),
                          lastSyncedAt: expect.any(Date),
                        };
                      }
                    )
                  ),
                  category: {
                    ...assertExists(vocabulary.category),
                    firstSyncedAt: expect.any(Date),
                    lastSyncedAt: expect.any(Date),
                  },
                  writing: {
                    ...assertExists(vocabulary.writing),
                    firstSyncedAt: expect.any(Date),
                    lastSyncedAt: expect.any(Date),
                  },
                  firstSyncedAt: expect.any(Date),
                  lastSyncedAt: expect.any(Date),
                };
              }
            )
          );

          expect(vocabularyIdSetIdPairs).toIncludeSameMembers(
            vocabularySetIdPairs.map(
              ([vocabulary, setId]): [string, string] => {
                return [vocabulary.vocabularyId, setId];
              }
            )
          );
        });

        test('get vocabulary list by lastest sync time without setId', async (): Promise<
          void
        > => {
          const {
            vocabularyList,
            vocabularyIdSetIdPairs,
          } = await vocabularyModel.getVocabularyListByLastSyncTime(
            shardDb,
            userId,
            10,
            undefined,
            undefined,
            true
          );

          expect(vocabularyList).toIncludeSameMembers(
            vocabularySetIdPairs.map(
              ([vocabulary]): Vocabulary => {
                return {
                  ...vocabulary,
                  definitions: expect.toIncludeSameMembers(
                    vocabulary.definitions.map(
                      (definition): Definition => {
                        return {
                          ...definition,
                          firstSyncedAt: expect.any(Date),
                          lastSyncedAt: expect.any(Date),
                        };
                      }
                    )
                  ),
                  category: {
                    ...assertExists(vocabulary.category),
                    firstSyncedAt: expect.any(Date),
                    lastSyncedAt: expect.any(Date),
                  },
                  writing: {
                    ...assertExists(vocabulary.writing),
                    firstSyncedAt: expect.any(Date),
                    lastSyncedAt: expect.any(Date),
                  },
                  firstSyncedAt: expect.any(Date),
                  lastSyncedAt: expect.any(Date),
                };
              }
            )
          );

          expect(vocabularyIdSetIdPairs).toIncludeSameMembers(
            vocabularySetIdPairs.map(
              ([vocabulary, setId]): [string, string] => {
                return [vocabulary.vocabularyId, setId];
              }
            )
          );
        });

        test('get vocabulary list by lastest sync time with setId', async (): Promise<
          void
        > => {
          const {
            vocabularyList,
            vocabularyIdSetIdPairs,
          } = await vocabularyModel.getVocabularyListByLastSyncTime(
            shardDb,
            userId,
            10,
            undefined,
            setList[0].setId,
            true
          );

          expect(vocabularyList).toIncludeSameMembers(
            vocabularySetIdPairs
              .filter(
                ([, setId]): boolean => {
                  return setId === setList[0].setId;
                }
              )
              .map(
                ([vocabulary]): Vocabulary => {
                  return {
                    ...vocabulary,
                    definitions: expect.toIncludeSameMembers(
                      vocabulary.definitions.map(
                        (definition): Definition => {
                          return {
                            ...definition,
                            firstSyncedAt: expect.any(Date),
                            lastSyncedAt: expect.any(Date),
                          };
                        }
                      )
                    ),
                    category: {
                      ...assertExists(vocabulary.category),
                      firstSyncedAt: expect.any(Date),
                      lastSyncedAt: expect.any(Date),
                    },
                    writing: {
                      ...assertExists(vocabulary.writing),
                      firstSyncedAt: expect.any(Date),
                      lastSyncedAt: expect.any(Date),
                    },
                    firstSyncedAt: expect.any(Date),
                    lastSyncedAt: expect.any(Date),
                  };
                }
              )
          );

          expect(vocabularyIdSetIdPairs).toIncludeSameMembers(
            vocabularySetIdPairs
              .filter(
                ([, setId]): boolean => {
                  return setId === setList[0].setId;
                }
              )
              .map(
                ([vocabulary, setId]): [string, string] => {
                  return [vocabulary.vocabularyId, setId];
                }
              )
          );
        });

        test('upsert existing vocabulary list', async (): Promise<void> => {
          const editedVocabularySetIdParis = vocabularySetIdPairs.map(
            ([vocabulary, setId]): [DeepPartial<Vocabulary>, string] => {
              return [
                {
                  vocabularyId: vocabulary.vocabularyId,
                  vocabularyText: 'edited ' + vocabulary.vocabularyText,
                  vocabularyStatus: VocabularyStatus.DELETED,
                  level: vocabulary.level + 1,
                  lastLearnedAt: moment().toDate(),
                  createdAt: moment().toDate(),
                  updatedAt: moment().toDate(),
                  updatedStatusAt: moment().toDate(),
                  definitions: vocabulary.definitions.map(
                    (definition): DeepPartial<Definition> => {
                      return {
                        definitionId: definition.definitionId,
                        meaning: 'edited ' + definition.meaning,
                        source: 'edited ' + definition.source,
                      };
                    }
                  ),
                  category: {
                    categoryName:
                      'edited ' +
                      assertExists(vocabulary.category).categoryName,
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate(),
                  },
                  writing: {
                    level: assertExists(vocabulary.writing).level + 1,
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate(),
                  },
                },
                setId,
              ];
            }
          );

          await shardDb.transaction(
            async (tx): Promise<void> => {
              return vocabularyModel.upsertMultipleVocabulary(
                tx,
                userId,
                editedVocabularySetIdParis
              );
            }
          );

          const {
            vocabularyList,
            vocabularyIdSetIdPairs,
          } = await vocabularyModel.getVocabularyByIds(
            shardDb,
            userId,
            vocabularySetIdPairs.map(
              ([vocabulary]): string => vocabulary.vocabularyId
            ),
            true
          );

          expect(vocabularyList).toIncludeSameMembers(
            vocabularySetIdPairs.map(
              ([vocabulary]): Vocabulary => {
                return {
                  ...vocabulary,
                  vocabularyText: 'edited ' + vocabulary.vocabularyText,
                  vocabularyStatus: VocabularyStatus.DELETED,
                  level: vocabulary.level + 1,
                  lastLearnedAt: moment().toDate(),
                  createdAt: moment().toDate(),
                  updatedAt: moment().toDate(),
                  updatedStatusAt: moment().toDate(),
                  definitions: expect.toIncludeSameMembers(
                    vocabulary.definitions.map(
                      (definition): Definition => {
                        return {
                          ...definition,
                          meaning: 'edited ' + definition.meaning,
                          source: 'edited ' + definition.source,
                          firstSyncedAt: expect.any(Date),
                          lastSyncedAt: expect.any(Date),
                        };
                      }
                    )
                  ),
                  category: {
                    ...assertExists(vocabulary.category),
                    categoryName:
                      'edited ' +
                      assertExists(vocabulary.category).categoryName,
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate(),
                    firstSyncedAt: expect.any(Date),
                    lastSyncedAt: expect.any(Date),
                  },
                  writing: {
                    ...assertExists(vocabulary.writing),
                    level: assertExists(vocabulary.writing).level + 1,
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate(),
                    firstSyncedAt: expect.any(Date),
                    lastSyncedAt: expect.any(Date),
                  },
                  firstSyncedAt: expect.any(Date),
                  lastSyncedAt: expect.any(Date),
                };
              }
            )
          );

          expect(vocabularyIdSetIdPairs).toIncludeSameMembers(
            vocabularySetIdPairs.map(
              ([vocabulary, setId]): [string, string] => {
                return [vocabulary.vocabularyId, setId];
              }
            )
          );
        });

        describe('Tests start after inserting another set into database', (): void => {
          let newSet: Set;
          beforeEach(
            async (): Promise<void> => {
              newSet = new SetBuilder().build({
                setName: 'second set',
                learningLanguageCode: 'vn',
                translatedToLanguageCode: 'en',
              });

              await shardDb.transaction(
                async (tx): Promise<void[]> => {
                  return Promise.all([
                    setModel.upsertSets(tx, userId, [newSet]),
                  ]);
                }
              );
            }
          );

          test('change setId of vocabulary list', async (): Promise<void> => {
            const newVocabularySetIdPairs = vocabularySetIdPairs.map(
              ([vocabulary]): [DeepPartial<Vocabulary>, string] => {
                return [
                  {
                    vocabularyId: vocabulary.vocabularyId,
                    updatedAt: moment().toDate(),
                  },
                  newSet.setId,
                ];
              }
            );

            await shardDb.transaction(
              async (tx): Promise<void> => {
                return vocabularyModel.upsertMultipleVocabulary(
                  tx,
                  userId,
                  newVocabularySetIdPairs
                );
              }
            );

            const {
              vocabularyList,
              vocabularyIdSetIdPairs,
            } = await vocabularyModel.getVocabularyByIds(
              shardDb,
              userId,
              vocabularySetIdPairs.map(
                ([vocabulary]): string => vocabulary.vocabularyId
              ),
              true
            );

            expect(vocabularyList).toIncludeSameMembers(
              vocabularySetIdPairs.map(
                ([vocabulary]): Vocabulary => {
                  return {
                    ...vocabulary,
                    definitions: expect.toIncludeSameMembers(
                      vocabulary.definitions.map(
                        (definition): Definition => {
                          return {
                            ...definition,
                            firstSyncedAt: expect.any(Date),
                            lastSyncedAt: expect.any(Date),
                          };
                        }
                      )
                    ),
                    category: {
                      ...assertExists(vocabulary.category),
                      firstSyncedAt: expect.any(Date),
                      lastSyncedAt: expect.any(Date),
                    },
                    writing: {
                      ...assertExists(vocabulary.writing),
                      firstSyncedAt: expect.any(Date),
                      lastSyncedAt: expect.any(Date),
                    },
                    firstSyncedAt: expect.any(Date),
                    lastSyncedAt: expect.any(Date),
                  };
                }
              )
            );

            expect(vocabularyIdSetIdPairs).toIncludeSameMembers(
              newVocabularySetIdPairs.map(
                ([vocabulary, setId]): [string, string] => {
                  return [assertExists(vocabulary.vocabularyId), setId];
                }
              )
            );
          });
        });
      });
    });
  });
});
