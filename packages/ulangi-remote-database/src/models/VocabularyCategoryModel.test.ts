/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import {
  Set,
  Vocabulary,
  VocabularyCategory,
} from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as knex from 'knex';
import * as moment from 'moment';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { SetModel } from '../models/SetModel';
import { VocabularyCategoryModel } from '../models/VocabularyCategoryModel';
import { VocabularyModel } from '../models/VocabularyModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('VocabularyCategoryModel', (): void => {
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
    let setModel: SetModel;
    let vocabularyModel: VocabularyModel;
    let vocabularyCategoryModel: VocabularyCategoryModel;

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

        vocabularyCategoryModel = modelFactory.createModel(
          'vocabularyCategoryModel'
        );
        vocabularyModel = modelFactory.createModel('vocabularyModel');
        setModel = modelFactory.createModel('setModel');
      }
    );

    afterEach(
      async (): Promise<void> => {
        await databaseFacade.closeAllDatabases();
      }
    );

    describe('Tests start after insert a set and some vocabulary into database', (): void => {
      let set: Set;
      let vocabularyList: readonly Vocabulary[];

      beforeEach(
        async (): Promise<void> => {
          set = new SetBuilder().build({
            setName: 'set',
            learningLanguageCode: 'en',
            translatedToLanguageCode: 'en',
          });

          vocabularyList = Array(4)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({
                  vocabularyText: 'test',
                });
              }
            );

          await shardDb.transaction(
            async (tx): Promise<void[]> => {
              return Promise.all([
                setModel.upsertSets(tx, userId, [set]),
                vocabularyModel.upsertMultipleVocabulary(
                  tx,
                  userId,
                  vocabularyList.map(
                    (vocabulary): [Vocabulary, string] => [
                      vocabulary,
                      set.setId,
                    ]
                  )
                ),
              ]);
            }
          );
        }
      );

      test('upsert vocabulary categories successfully', async (): Promise<
        void
      > => {
        const vocabularyCategoryVocabularyIdPairs = vocabularyList.map(
          (vocabulary): [DeepPartial<VocabularyCategory>, string] => {
            return [
              {
                categoryName: 'categoryName',
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
              },
              vocabulary.vocabularyId,
            ];
          }
        );

        await shardDb.transaction(
          async (tx): Promise<void> => {
            return vocabularyCategoryModel.upsertVocabularyCategories(
              tx,
              userId,
              vocabularyCategoryVocabularyIdPairs
            );
          }
        );
      });

      describe('Tests start after inserting vocabulary category into database', (): void => {
        let vocabularyCategoryVocabularyIdPairs: readonly [
          DeepPartial<VocabularyCategory>,
          string
        ][];

        beforeEach(
          async (): Promise<void> => {
            vocabularyCategoryVocabularyIdPairs = vocabularyList.map(
              (
                vocabulary,
                index
              ): [DeepPartial<VocabularyCategory>, string] => {
                return [
                  {
                    categoryName: 'categoryName' + index,
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate(),
                  },
                  vocabulary.vocabularyId,
                ];
              }
            );

            await shardDb.transaction(
              async (tx): Promise<void> => {
                return vocabularyCategoryModel.upsertVocabularyCategories(
                  tx,
                  userId,
                  vocabularyCategoryVocabularyIdPairs
                );
              }
            );
          }
        );

        test('get vocabulary category by vocabulary ids', async (): Promise<
          void
        > => {
          const {
            vocabularyCategoryPerVocabularyId,
          } = await vocabularyCategoryModel.getVocabularyCategoriesByVocabularyIds(
            shardDb,
            userId,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          vocabularyCategoryVocabularyIdPairs.forEach(
            ([vocabularyCategory, vocabularyId]): void => {
              expect(vocabularyCategoryPerVocabularyId[vocabularyId]).toEqual({
                ...vocabularyCategory,
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              });
            }
          );
        });

        test('upsert existing vocabulary category', async (): Promise<void> => {
          const newVocabularyCategoryVocabularyIdPairs = vocabularyCategoryVocabularyIdPairs.map(
            (
              [vocabularyCategory, vocabularyId],
              index
            ): [DeepPartial<VocabularyCategory>, string] => {
              return [
                {
                  ...vocabularyCategory,
                  categoryName: 'edited' + index,
                  createdAt: moment().toDate(),
                  updatedAt: moment().toDate(),
                },
                vocabularyId,
              ];
            }
          );

          await shardDb.transaction(
            async (tx): Promise<void> => {
              await vocabularyCategoryModel.upsertVocabularyCategories(
                tx,
                userId,
                newVocabularyCategoryVocabularyIdPairs
              );
            }
          );

          const {
            vocabularyCategoryPerVocabularyId,
          } = await vocabularyCategoryModel.getVocabularyCategoriesByVocabularyIds(
            shardDb,
            userId,
            vocabularyCategoryVocabularyIdPairs.map(
              ([, vocabularyId]): string => vocabularyId
            ),
            true
          );

          vocabularyCategoryVocabularyIdPairs.forEach(
            ([vocabularyCategory, vocabularyId], index): void => {
              expect(vocabularyCategoryPerVocabularyId[vocabularyId]).toEqual({
                ...vocabularyCategory,
                categoryName: 'edited' + index,
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              });
            }
          );
        });
      });
    });
  });
});
