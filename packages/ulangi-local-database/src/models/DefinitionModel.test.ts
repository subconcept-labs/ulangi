/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import {
  DefinitionBuilder,
  SetBuilder,
  VocabularyBuilder,
} from '@ulangi/ulangi-common/builders';
import {
  DefinitionStatus,
  SetStatus,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Definition, Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DefinitionModel } from './DefinitionModel';
import { DirtyDefinitionModel } from './DirtyDefinitionModel';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';

describe('DefinitionModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let databaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let definitionModel: DefinitionModel;
    let vocabularyModel: VocabularyModel;
    let dirtyDefinitionModel: DirtyDefinitionModel;
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
        vocabularyModel = modelFactory.createModel('vocabularyModel');
        definitionModel = modelFactory.createModel('definitionModel');
        dirtyDefinitionModel = modelFactory.createModel('dirtyDefinitionModel');

        restoreCurrentTime = mockCurrentTime();
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    describe('Tests start after inserting a set into database', (): void => {
      let set: Set;
      beforeEach(
        async (): Promise<void> => {
          set = new SetBuilder().build({
            setId: 'setId',
            setStatus: SetStatus.ACTIVE,
            setName: 'setName',
            learningLanguageCode: 'en',
            translatedToLanguageCode: 'en',
          });

          await userDb.transaction(
            (tx): void => {
              setModel.insertSet(tx, set, 'local');
            }
          );
        }
      );

      describe('Tests start after inserting some vocabulary with definitions from local', (): void => {
        let vocabularyList: Vocabulary[];

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
                      new DefinitionBuilder().build({
                        meaning: 'meaning' + index,
                        source: 'source',
                      }),
                    ],
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
                      set.setId,
                    ]
                  ),
                  'local'
                );
              }
            );
          }
        );

        test('get definitions by vocabulary id', async (): Promise<void> => {
          const {
            definitionList,
          } = await definitionModel.getDefinitionsByVocabularyId(
            userDb,
            vocabularyList[0].vocabularyId,
            DefinitionStatus.ACTIVE,
            true
          );

          expect(definitionList).toEqual(vocabularyList[0].definitions);
        });

        test('get definitions by vocabulary ids', async (): Promise<void> => {
          const {
            definitionsPerVocabularyId,
          } = await definitionModel.getDefinitionsByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            DefinitionStatus.ACTIVE,
            true
          );

          vocabularyList.forEach(
            (vocabulary): void => {
              expect(
                definitionsPerVocabularyId[vocabulary.vocabularyId]
              ).toIncludeSameMembers(vocabulary.definitions.slice());
            }
          );
        });

        test('local upsert new definitions', async (): Promise<void> => {
          const newDefinitionVocabularyIdPairs = vocabularyList.map(
            (vocabulary, index): [Definition, string] => {
              return [
                new DefinitionBuilder().build({
                  meaning: 'new meaning ' + index,
                  source: 'new source ' + index,
                }),
                vocabulary.vocabularyId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              definitionModel.upsertDefinitions(
                tx,
                newDefinitionVocabularyIdPairs,
                'local'
              );
            }
          );

          const {
            definitionsPerVocabularyId,
          } = await definitionModel.getDefinitionsByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            DefinitionStatus.ACTIVE,
            true
          );

          newDefinitionVocabularyIdPairs.forEach(
            ([newDefinitions, vocabularyId], index): void => {
              expect(
                definitionsPerVocabularyId[vocabularyId]
              ).toIncludeSameMembers(
                vocabularyList[index].definitions.concat(newDefinitions)
              );
            }
          );
        });

        test('local upsert existing definitions', async (): Promise<void> => {
          const editedDefinitionVocabularyIdPairs = _.flatMap(
            vocabularyList,
            (vocabulary): [DeepPartial<Definition>, string][] => {
              return vocabulary.definitions.map(
                (definition): [DeepPartial<Definition>, string] => {
                  return [
                    {
                      definitionId: definition.definitionId,
                      meaning: 'edited ' + definition.meaning,
                    },
                    vocabulary.vocabularyId,
                  ];
                }
              );
            }
          );

          await userDb.transaction(
            (tx): void => {
              definitionModel.upsertDefinitions(
                tx,
                editedDefinitionVocabularyIdPairs,
                'local'
              );
            }
          );

          const {
            definitionsPerVocabularyId,
          } = await definitionModel.getDefinitionsByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            DefinitionStatus.ACTIVE,
            true
          );

          editedDefinitionVocabularyIdPairs.forEach(
            ([, vocabularyId], index): void => {
              expect(
                definitionsPerVocabularyId[vocabularyId]
              ).toIncludeSameMembers(
                vocabularyList[index].definitions.map(
                  (definition): Definition => {
                    return {
                      ...definition,
                      meaning: 'edited ' + definition.meaning,
                    };
                  }
                )
              );
            }
          );
        });

        test('local upsert should mark records as dirty', async (): Promise<
          void
        > => {
          const {
            definitionsPerVocabularyId,
          } = await dirtyDefinitionModel.getDirtyDefinitionsForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyList.forEach(
            (vocabulary): void => {
              expect(
                definitionsPerVocabularyId[vocabulary.vocabularyId]
              ).toIncludeSameMembers(vocabulary.definitions.slice());
            }
          );
        });

        test('local upsert should overwrite dirty records', async (): Promise<
          void
        > => {
          const editedDefinitionVocabularyIdPairs = _.flatMap(
            vocabularyList,
            (vocabulary): [DeepPartial<Definition>, string][] => {
              return vocabulary.definitions.map(
                (definition): [DeepPartial<Definition>, string] => {
                  return [
                    {
                      definitionId: definition.definitionId,
                      meaning: 'edited ' + definition.meaning,
                    },
                    vocabulary.vocabularyId,
                  ];
                }
              );
            }
          );

          await userDb.transaction(
            (tx): void => {
              definitionModel.upsertDefinitions(
                tx,
                editedDefinitionVocabularyIdPairs,
                'local'
              );
            }
          );

          const {
            definitionsPerVocabularyId,
          } = await dirtyDefinitionModel.getDirtyDefinitionsForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          editedDefinitionVocabularyIdPairs.forEach(
            ([, vocabularyId], index): void => {
              expect(
                definitionsPerVocabularyId[vocabularyId]
              ).toIncludeSameMembers(
                vocabularyList[index].definitions.map(
                  (definition): Definition => {
                    return {
                      ...definition,
                      meaning: 'edited ' + definition.meaning,
                    };
                  }
                )
              );
            }
          );
        });
      });

      describe('Tests start after inserting some vocabulary with definitions from remote', (): void => {
        let vocabularyList: Vocabulary[];

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
                      set.setId,
                    ]
                  ),
                  'remote'
                );
              }
            );
          }
        );

        test('remote upsert should not mark records as dirty', async (): Promise<
          void
        > => {
          const {
            definitionsPerVocabularyId,
          } = await dirtyDefinitionModel.getDirtyDefinitionsForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          _.forOwn(
            definitionsPerVocabularyId,
            (definitions): void => {
              expect(definitions).toEqual([]);
            }
          );
        });

        test('remote upsert new definitions', async (): Promise<void> => {
          const newDefinitionVocabularyIdPairs = vocabularyList.map(
            (vocabulary, index): [Definition, string] => {
              return [
                new DefinitionBuilder().build({
                  meaning: 'new meaning ' + index,
                  source: 'new source ' + index,
                }),
                vocabulary.vocabularyId,
              ];
            }
          );

          await userDb.transaction(
            (tx): void => {
              definitionModel.upsertDefinitions(
                tx,
                newDefinitionVocabularyIdPairs,
                'remote'
              );
            }
          );

          const {
            definitionsPerVocabularyId,
          } = await definitionModel.getDefinitionsByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            DefinitionStatus.ACTIVE,
            true
          );

          newDefinitionVocabularyIdPairs.forEach(
            ([newDefinitions, vocabularyId], index): void => {
              expect(
                definitionsPerVocabularyId[vocabularyId]
              ).toIncludeSameMembers(
                vocabularyList[index].definitions.concat(newDefinitions)
              );
            }
          );
        });

        test('remote upsert existing records should overwrite only clean fields', async (): Promise<
          void
        > => {
          // Mark meaning fields as dirty
          const firstEditedDefinitionVocabularyIdPairs = _.flatMap(
            vocabularyList,
            (vocabulary): [DeepPartial<Definition>, string][] => {
              return vocabulary.definitions.map(
                (definition): [DeepPartial<Definition>, string] => {
                  return [
                    {
                      definitionId: definition.definitionId,
                      meaning: 'first edited ' + definition.meaning,
                    },
                    vocabulary.vocabularyId,
                  ];
                }
              );
            }
          );

          await userDb.transaction(
            (tx): void => {
              definitionModel.upsertDefinitions(
                tx,
                firstEditedDefinitionVocabularyIdPairs,
                'local'
              );
            }
          );

          const secondEditedDefinitionVocabularyIdPairs = _.flatMap(
            vocabularyList,
            (vocabulary): [DeepPartial<Definition>, string][] => {
              return vocabulary.definitions.map(
                (definition): [DeepPartial<Definition>, string] => {
                  return [
                    {
                      definitionId: definition.definitionId,
                      meaning: 'second edited ' + definition.meaning,
                      source: 'second edited ' + definition.source,
                    },
                    vocabulary.vocabularyId,
                  ];
                }
              );
            }
          );

          await userDb.transaction(
            (tx): void => {
              definitionModel.upsertDefinitions(
                tx,
                secondEditedDefinitionVocabularyIdPairs,
                'remote'
              );
            }
          );

          const {
            definitionsPerVocabularyId,
          } = await definitionModel.getDefinitionsByVocabularyIds(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            DefinitionStatus.ACTIVE,
            true
          );

          // Should update source but not meaning
          firstEditedDefinitionVocabularyIdPairs.forEach(
            ([, vocabularyId], index): void => {
              expect(
                definitionsPerVocabularyId[vocabularyId]
              ).toIncludeSameMembers(
                vocabularyList[index].definitions.map(
                  (definition): Definition => {
                    return {
                      ...definition,
                      meaning: 'first edited ' + definition.meaning,
                      source: 'second edited ' + definition.source,
                      updatedAt: moment().toDate(),
                    };
                  }
                )
              );
            }
          );
        });
      });
    });

    test('local upsert definition failed due to foreign constraint', async (): Promise<
      void
    > => {
      const definition = new DefinitionBuilder().build({
        meaning: 'meaning',
        source: 'source',
      });
      await expect(
        userDb.transaction(
          (tx): void => {
            definitionModel.upsertDefinition(
              tx,
              definition,
              'unexisting vocabulary id',
              'local'
            );
          }
        )
      ).rejects.toThrow();
    });
  });
});
