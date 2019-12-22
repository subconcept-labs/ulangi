/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { IncompatibleVocabularyModel } from './IncompatibleVocabularyModel';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('IncompatibileVocabularyModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let mockedDatabaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let vocabularyModel: VocabularyModel;
    let incompatibleVocabularyModel: IncompatibleVocabularyModel;
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
        incompatibleVocabularyModel = modelFactory.createModel(
          'incompatibleVocabularyModel'
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

        test('upsert incompatible vocabulary', async (): Promise<void> => {
          const incompatibleVocabularyIds = vocabularyList.map(
            (vocabulary): string => vocabulary.vocabularyId
          );

          // Should update without any problems
          await userDb.transaction(
            (tx): void => {
              incompatibleVocabularyModel.upsertMultipleIncompatibleVocabulary(
                tx,
                incompatibleVocabularyIds,
                '0001.0001.0001'
              );
            }
          );

          const {
            vocabularyIds,
          } = await incompatibleVocabularyModel.getIncompatibleVocabularyIdsForRedownload(
            userDb,
            '0001.0001.0002',
            10,
            true
          );

          expect(vocabularyIds).toIncludeSameMembers(incompatibleVocabularyIds);
        });

        test('upser incompatible version should overwrite existing version', async (): Promise<
          void
        > => {
          const incompatibleVocabularyIds = vocabularyList.map(
            (vocabulary): string => vocabulary.vocabularyId
          );

          await userDb.transaction(
            (tx): void => {
              incompatibleVocabularyModel.upsertMultipleIncompatibleVocabulary(
                tx,
                incompatibleVocabularyIds,
                '0002.0001.0001'
              );
            }
          );

          // Should update without any problems
          await userDb.transaction(
            (tx): void => {
              incompatibleVocabularyModel.upsertMultipleIncompatibleVocabulary(
                tx,
                incompatibleVocabularyIds,
                '0001.0001.0001'
              );
            }
          );

          const {
            vocabularyIds,
          } = await incompatibleVocabularyModel.getIncompatibleVocabularyIdsForRedownload(
            userDb,
            '0001.0001.0002',
            10,
            true
          );

          expect(vocabularyIds).toIncludeSameMembers(incompatibleVocabularyIds);
        });

        describe('Tests start aftering inserting incompatible vocabulary', (): void => {
          let incompatibleVocabularyIds: readonly string[];

          beforeEach(
            async (): Promise<void> => {
              incompatibleVocabularyIds = vocabularyList.map(
                (vocabulary): string => vocabulary.vocabularyId
              );

              await userDb.transaction(
                (tx): void => {
                  incompatibleVocabularyModel.upsertMultipleIncompatibleVocabulary(
                    tx,
                    incompatibleVocabularyIds,
                    '0003.0004.0005'
                  );
                }
              );
            }
          );

          test('delete incompatible vocabulary', async (): Promise<void> => {
            await userDb.transaction(
              (tx): void => {
                incompatibleVocabularyModel.deleteMultipleIncompatibleVocabulary(
                  tx,
                  incompatibleVocabularyIds
                );
              }
            );

            const {
              vocabularyIds,
            } = await incompatibleVocabularyModel.getIncompatibleVocabularyIdsForRedownload(
              userDb,
              '0003.0004.0006',
              10,
              true
            );

            expect(vocabularyIds).toEqual([]);
          });

          test('should return incompatible vocabulary ids if current version is higher', async (): Promise<
            void
          > => {
            const {
              vocabularyIds,
            } = await incompatibleVocabularyModel.getIncompatibleVocabularyIdsForRedownload(
              userDb,
              '0003.0004.0006',
              10,
              true
            );

            expect(vocabularyIds).toIncludeSameMembers(
              incompatibleVocabularyIds.slice()
            );
          });

          test('should not return incompatible vocabulary ids if current version is equal to the last tried version', async (): Promise<
            void
          > => {
            const {
              vocabularyIds,
            } = await incompatibleVocabularyModel.getIncompatibleVocabularyIdsForRedownload(
              userDb,
              '0003.0004.0005',
              10,
              true
            );

            expect(vocabularyIds).toIncludeSameMembers([]);
          });

          test('should return incompatible vocabulary ids if current version is lower', async (): Promise<
            void
          > => {
            const {
              vocabularyIds,
            } = await incompatibleVocabularyModel.getIncompatibleVocabularyIdsForRedownload(
              userDb,
              '0003.0004.0004',
              10,
              true
            );

            expect(vocabularyIds).toIncludeSameMembers([]);
          });
        });
      });
    });
  });
});
