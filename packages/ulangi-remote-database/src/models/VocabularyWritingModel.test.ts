/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import {
  Set,
  Vocabulary,
  VocabularyWriting,
} from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as knex from 'knex';
import * as moment from 'moment';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { SetModel } from '../models/SetModel';
import { VocabularyModel } from '../models/VocabularyModel';
import { VocabularyWritingModel } from '../models/VocabularyWritingModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('VocabularyWritingModel', (): void => {
  const env = resolveEnv();

  let userId: string;
  let restoreCurrentTime: () => void;

  beforeEach(
    (): void => {
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
    let vocabularyWritingModel: VocabularyWritingModel;

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
        vocabularyWritingModel = modelFactory.createModel(
          'vocabularyWritingModel'
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
                    (vocabulary): [Vocabulary, string] => {
                      return [vocabulary, set.setId];
                    }
                  )
                ),
              ]);
            }
          );
        }
      );

      test('upsert vocabulary writing successfully', async (): Promise<
        void
      > => {
        const vocabularyWritingVocabularyIdPairs = vocabularyList.map(
          (vocabulary): [DeepPartial<VocabularyWriting>, string] => {
            return [
              {
                disabled: false,
                level: 1,
                lastWrittenAt: moment().toDate(),
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
              },
              vocabulary.vocabularyId,
            ];
          }
        );

        await shardDb.transaction(
          async (tx): Promise<void> => {
            return vocabularyWritingModel.upsertVocabularyWritings(
              tx,
              userId,
              vocabularyWritingVocabularyIdPairs
            );
          }
        );

        const {
          vocabularyWritingPerVocabularyId,
        } = await vocabularyWritingModel.getVocabularyWritingsByVocabularyIds(
          shardDb,
          userId,
          vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
          true
        );

        vocabularyWritingVocabularyIdPairs.forEach(
          ([vocabularyWriting, vocabularyId]): void => {
            expect(vocabularyWritingPerVocabularyId[vocabularyId]).toEqual({
              ...vocabularyWriting,
              firstSyncedAt: expect.any(Date),
              lastSyncedAt: expect.any(Date),
            });
          }
        );
      });

      describe('Tests start after inserting vocabulary writing into database', (): void => {
        let vocabularyWritingVocabularyIdPairs: readonly [
          DeepPartial<VocabularyWriting>,
          string
        ][];

        beforeEach(
          async (): Promise<void> => {
            vocabularyWritingVocabularyIdPairs = vocabularyList.map(
              (vocabulary, index): [DeepPartial<VocabularyWriting>, string] => {
                return [
                  {
                    level: index,
                    disabled: false,
                    lastWrittenAt: moment().toDate(),
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate(),
                  },
                  vocabulary.vocabularyId,
                ];
              }
            );

            await shardDb.transaction(
              async (tx): Promise<void> => {
                return vocabularyWritingModel.upsertVocabularyWritings(
                  tx,
                  userId,
                  vocabularyWritingVocabularyIdPairs
                );
              }
            );
          }
        );

        test('get vocabulary writings by vocabulary ids', async (): Promise<
          void
        > => {
          const {
            vocabularyWritingPerVocabularyId,
          } = await vocabularyWritingModel.getVocabularyWritingsByVocabularyIds(
            shardDb,
            userId,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyWritingVocabularyIdPairs.forEach(
            ([vocabularyWriting, vocabularyId]): void => {
              expect(vocabularyWritingPerVocabularyId[vocabularyId]).toEqual({
                ...vocabularyWriting,
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              });
            }
          );
        });

        test('upsert existing multiple vocabulary writing', async (): Promise<
          void
        > => {
          const newVocabularyWritingVocabularyIdPairs = vocabularyWritingVocabularyIdPairs.map(
            ([vocabularyWriting, vocabularyId]): [
              DeepPartial<VocabularyWriting>,
              string
            ] => {
              return [
                {
                  disabled: true,
                  level: assertExists(vocabularyWriting.level) + 1,
                  lastWrittenAt: moment().toDate(),
                  createdAt: moment().toDate(),
                  updatedAt: moment().toDate(),
                },
                vocabularyId,
              ];
            }
          );

          await shardDb.transaction(
            async (tx): Promise<void> => {
              return vocabularyWritingModel.upsertVocabularyWritings(
                tx,
                userId,
                newVocabularyWritingVocabularyIdPairs
              );
            }
          );

          const {
            vocabularyWritingPerVocabularyId,
          } = await vocabularyWritingModel.getVocabularyWritingsByVocabularyIds(
            shardDb,
            userId,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyWritingVocabularyIdPairs.forEach(
            ([vocabularyWriting, vocabularyId]): void => {
              expect(vocabularyWritingPerVocabularyId[vocabularyId]).toEqual({
                ...vocabularyWriting,
                disabled: true,
                level: assertExists(vocabularyWriting.level) + 1,
                lastWrittenAt: moment().toDate(),
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
