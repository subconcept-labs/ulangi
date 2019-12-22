/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { FieldState } from '../enums/FieldState';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyVocabularyFieldRow } from '../interfaces/DirtyVocabularyFieldRow';
import { DirtyVocabularyModel } from './DirtyVocabularyModel';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('DirtyVocabularyModel', (): void => {
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

        test('get dirty vocabulary', async (): Promise<void> => {
          const {
            vocabularyList: dirtyVocabularyList,
            vocabularyIdSetIdPairs,
          } = await dirtyVocabularyModel.getDirtyVocabularyListForSyncing(
            userDb,
            10,
            true
          );

          expect(dirtyVocabularyList).toIncludeSameMembers(
            vocabularyList.slice()
          );

          expect(vocabularyIdSetIdPairs).toIncludeSameMembers(
            vocabularyList.map(
              (vocabulary, index): [string, string] => [
                vocabulary.vocabularyId,
                setList[index % setList.length].setId,
              ]
            )
          );
        });

        test('mark records as synced', async (): Promise<void> => {
          const {
            markVocabularyListAsSynced,
          } = await dirtyVocabularyModel.getDirtyVocabularyListForSyncing(
            userDb,
            10,
            true
          );

          const syncedVocabularyIds = vocabularyList
            .filter((_, index): boolean => index % 2 === 0)
            .map((vocabulary): string => vocabulary.vocabularyId);

          await userDb.transaction(
            (tx): void => {
              markVocabularyListAsSynced(tx, syncedVocabularyIds);
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
            vocabularyList.filter((_, index): boolean => index % 2 !== 0)
          );
        });

        test('delete dirty fields', async (): Promise<void> => {
          // Delete vocabularyText field only
          await userDb.transaction(
            (tx): void => {
              dirtyVocabularyModel.deleteDirtyFields(
                tx,
                vocabularyList.map(
                  (
                    vocabulary
                  ): Pick<
                    DirtyVocabularyFieldRow,
                    'vocabularyId' | 'fieldName'
                  > => {
                    return {
                      vocabularyId: vocabulary.vocabularyId,
                      fieldName: 'vocabularyText',
                    };
                  }
                ),
                { withState: FieldState.TO_BE_SYNCED }
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
              (vocabulary): DeepPartial<Vocabulary> =>
                _.omit(vocabulary, 'vocabularyText')
            )
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

        test('get dirty vocabulary should return dirty fields only', async (): Promise<
          void
        > => {
          await userDb.transaction(
            (tx): void => {
              vocabularyModel.updateMultipleVocabulary(
                tx,
                vocabularyList.map(
                  (vocabulary): [DeepPartial<Vocabulary>, string] => {
                    return [
                      {
                        vocabularyId: vocabulary.vocabularyId,
                        vocabularyText: 'edited ' + vocabulary.vocabularyText,
                      },
                      setList[1].setId,
                    ];
                  }
                ),
                'local'
              );
            }
          );

          const {
            vocabularyList: dirtyVocabularyList,
            vocabularyIdSetIdPairs,
          } = await dirtyVocabularyModel.getDirtyVocabularyListForSyncing(
            userDb,
            10,
            true
          );

          expect(dirtyVocabularyList).toIncludeSameMembers(
            vocabularyList.map(
              (vocabulary): DeepPartial<Vocabulary> => {
                return {
                  vocabularyId: vocabulary.vocabularyId,
                  vocabularyText: 'edited ' + vocabulary.vocabularyText,
                  updatedAt: moment().toDate(),
                  extraData: [],
                };
              }
            )
          );

          expect(vocabularyIdSetIdPairs).toIncludeSameMembers(
            vocabularyList.map(
              (vocabulary): [string, string] => [
                vocabulary.vocabularyId,
                setList[1].setId,
              ]
            )
          );
        });
      });
    });
  });
});
