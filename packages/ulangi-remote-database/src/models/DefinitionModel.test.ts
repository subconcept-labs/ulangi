/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  DefinitionBuilder,
  SetBuilder,
  VocabularyBuilder,
} from '@ulangi/ulangi-common/builders';
import { DefinitionStatus, WordClass } from '@ulangi/ulangi-common/enums';
import { Definition, Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as knex from 'knex';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DefinitionModel } from '../models/DefinitionModel';
import { SetModel } from '../models/SetModel';
import { VocabularyModel } from '../models/VocabularyModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('DefinitionModel', (): void => {
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
    let definitionModel: DefinitionModel;

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

        definitionModel = modelFactory.createModel('definitionModel');
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

      test('upsert new definitions successfully', async (): Promise<void> => {
        const definitionVocabularyIdPairs = vocabularyList.map(
          (vocabulary, index): [Definition, string] => [
            new DefinitionBuilder().build({
              meaning: 'meaning' + index,
              source: 'source' + index,
            }),
            vocabulary.vocabularyId,
          ]
        );

        await shardDb.transaction(
          async (tx): Promise<void[]> => {
            return definitionModel.upsertDefinitions(
              tx,
              userId,
              definitionVocabularyIdPairs
            );
          }
        );

        const {
          definitionsPerVocabularyId,
        } = await definitionModel.getDefinitionsPerVocabularyId(
          shardDb,
          userId,
          vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
          true
        );

        _.forOwn(
          definitionsPerVocabularyId,
          (definitions, vocabularyId): void => {
            expect(definitions).toIncludeSameMembers(
              definitionVocabularyIdPairs
                .filter((pair): boolean => pair[1] === vocabularyId)
                .map(
                  ([definition]): Definition => {
                    return {
                      ...definition,
                      firstSyncedAt: expect.any(Date),
                      lastSyncedAt: expect.any(Date),
                    };
                  }
                )
            );
          }
        );
      });

      describe('Tests start after inserting definitions into database', (): void => {
        let definitionVocabularyIdPairs: readonly [Definition, string][];
        let restoreCurrentTime: () => void;

        beforeEach(
          async (): Promise<void> => {
            restoreCurrentTime = mockCurrentTime();
            definitionVocabularyIdPairs = vocabularyList.map(
              (vocabulary, index): [Definition, string] => {
                return [
                  new DefinitionBuilder().build({
                    meaning: 'meaning' + index,
                    source: 'source' + index,
                  }),
                  vocabulary.vocabularyId,
                ];
              }
            );

            await shardDb.transaction(
              async (tx): Promise<void[]> => {
                return definitionModel.upsertDefinitions(
                  tx,
                  userId,
                  definitionVocabularyIdPairs
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

        test('get definitions by vocabulary ids', async (): Promise<void> => {
          const {
            definitionsPerVocabularyId,
          } = await definitionModel.getDefinitionsPerVocabularyId(
            shardDb,
            userId,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          _.forOwn(
            definitionsPerVocabularyId,
            (definitions, vocabularyId): void => {
              expect(definitions).toIncludeSameMembers(
                definitionVocabularyIdPairs
                  .filter((pair): boolean => pair[1] === vocabularyId)
                  .map(
                    ([definition]): Definition => {
                      return {
                        ...definition,
                        firstSyncedAt: expect.any(Date),
                        lastSyncedAt: expect.any(Date),
                      };
                    }
                  )
              );
            }
          );
        });

        test('upsert existing definitions', async (): Promise<void> => {
          const editedDefinitionVocabularyIdPairs = definitionVocabularyIdPairs.map(
            ([definition, vocabularyId]): [Definition, string] => {
              return [
                {
                  ...definition,
                  definitionStatus: DefinitionStatus.DELETED,
                  meaning: 'edited meaning',
                  wordClasses: [WordClass.ADJECTIVE],
                  source: 'edited source',
                  createdAt: moment().toDate(),
                  updatedAt: moment().toDate(),
                  updatedStatusAt: moment().toDate(),
                },
                vocabularyId,
              ];
            }
          );

          await shardDb.transaction(
            async (tx): Promise<void[]> => {
              return definitionModel.upsertDefinitions(
                tx,
                userId,
                editedDefinitionVocabularyIdPairs
              );
            }
          );

          const {
            definitionsPerVocabularyId,
          } = await definitionModel.getDefinitionsPerVocabularyId(
            shardDb,
            userId,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          _.forOwn(
            definitionsPerVocabularyId,
            (definitions, vocabularyId): void => {
              expect(definitions).toIncludeSameMembers(
                definitionVocabularyIdPairs
                  .filter((pair): boolean => pair[1] === vocabularyId)
                  .map(
                    ([definition]): Definition => {
                      return {
                        ...definition,
                        definitionStatus: DefinitionStatus.DELETED,
                        meaning: 'edited meaning',
                        wordClasses: [WordClass.ADJECTIVE],
                        source: 'edited source',
                        createdAt: moment().toDate(),
                        updatedAt: moment().toDate(),
                        updatedStatusAt: moment().toDate(),
                        firstSyncedAt: expect.any(Date),
                        lastSyncedAt: expect.any(Date),
                      };
                    }
                  )
              );
            }
          );
        });
      });
    });
  });
});
