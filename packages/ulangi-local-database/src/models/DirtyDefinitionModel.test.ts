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
import { SetStatus, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Definition, Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { FieldState } from '../enums/FieldState';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyDefinitionFieldRow } from '../interfaces/DirtyDefinitionFieldRow';
import { DefinitionModel } from './DefinitionModel';
import { DirtyDefinitionModel } from './DirtyDefinitionModel';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';

describe('DirtyDefinitionModel', (): void => {
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

        test('get dirty definitions', async (): Promise<void> => {
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

        test('mark records as synced', async (): Promise<void> => {
          const {
            markDefinitionsAsSynced,
          } = await dirtyDefinitionModel.getDirtyDefinitionsForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          const syncedVocabularyIds = vocabularyList
            .filter((_, index): boolean => index % 2 === 0)
            .map((vocabulary): string => vocabulary.vocabularyId);

          await userDb.transaction(
            (tx): void => {
              markDefinitionsAsSynced(tx, syncedVocabularyIds);
            }
          );

          const {
            definitionsPerVocabularyId,
          } = await dirtyDefinitionModel.getDirtyDefinitionsForSyncing(
            userDb,
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId),
            true
          );

          vocabularyList.forEach(
            (vocabulary, index): void => {
              if (index % 2 === 0) {
                expect(
                  definitionsPerVocabularyId[vocabulary.vocabularyId]
                ).toEqual(undefined);
              } else {
                expect(
                  definitionsPerVocabularyId[vocabulary.vocabularyId]
                ).toIncludeSameMembers(vocabulary.definitions.slice());
              }
            }
          );
        });

        test('delete dirty fields', async (): Promise<void> => {
          await userDb.transaction(
            (tx): void => {
              dirtyDefinitionModel.deleteDirtyFields(
                tx,
                _.flatMap(
                  vocabularyList,
                  (
                    vocabulary
                  ): readonly Pick<
                    DirtyDefinitionFieldRow,
                    'definitionId' | 'fieldName'
                  >[] =>
                    vocabulary.definitions.map(
                      (
                        definition
                      ): Pick<
                        DirtyDefinitionFieldRow,
                        'definitionId' | 'fieldName'
                      > => {
                        return {
                          definitionId: definition.definitionId,
                          fieldName: 'meaning',
                        };
                      }
                    )
                ),
                { withState: FieldState.TO_BE_SYNCED }
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

          _.forOwn(
            definitionsPerVocabularyId,
            (definitions): void => {
              definitions.forEach(
                (definition): void => {
                  expect(definition.meaning).toBeUndefined();
                }
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

        test('get dirty definitions should return dirty fields only', async (): Promise<
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
                  (definition): DeepPartial<Definition> => {
                    return {
                      definitionId: definition.definitionId,
                      meaning: 'edited ' + definition.meaning,
                      updatedAt: moment().toDate(),
                      extraData: [],
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
