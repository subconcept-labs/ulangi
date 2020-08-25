/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import {
  CategorySortType,
  SetStatus,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Set, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { CategoryModel } from './CategoryModel';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';

describe('VocabularyCategoryModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let databaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let categoryModel: CategoryModel;
    let vocabularyModel: VocabularyModel;
    let restoreCurrentTime: () => void;

    beforeEach(
      async (): Promise<void> => {
        restoreCurrentTime = mockCurrentTime();
        databaseFacade = new DatabaseFacade(new SQLiteDatabaseAdapter(sqlite3));
        databaseEventBus = new DatabaseEventBus();

        await databaseFacade.connectUserDb((await tmp.file()).path);
        await databaseFacade.checkUserDb();
        userDb = databaseFacade.getDb('user');

        modelFactory = new ModelFactory(databaseEventBus);

        setModel = modelFactory.createModel('setModel');
        categoryModel = modelFactory.createModel('categoryModel');
        vocabularyModel = modelFactory.createModel('vocabularyModel');
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    describe('Tests start after inserting a set', (): void => {
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

      describe('Test starts after adding uncategorized and categorized vocabulary from local', (): void => {
        let vocabularyList: readonly Vocabulary[];

        beforeEach(
          async (): Promise<void> => {
            vocabularyList = Array(4)
              .fill(null)
              .map(
                (_, index): Vocabulary => {
                  return new VocabularyBuilder().build({
                    vocabularyId: 'vocabularyId' + index,
                    vocabularyStatus: VocabularyStatus.ACTIVE,
                    vocabularyText: 'vocabularyText' + index,
                    level: index,
                    category: {
                      categoryName:
                        index % 2 === 0 ? 'Uncategorized' : 'A Category',
                    },
                    writing: {
                      level: index,
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
                      set.setId,
                    ]
                  ),
                  'local'
                );
              }
            );
          }
        );

        test('return category list (including Uncategorized category)', async (): Promise<
          void
        > => {
          const {
            categoryList,
          } = await categoryModel.getCategoryListByVocabularyStatus(
            userDb,
            set.setId,
            VocabularyStatus.ACTIVE,
            CategorySortType.SORT_BY_NAME_DESC,
            10,
            0
          );

          expect(categoryList).toEqual([
            {
              categoryName: 'Uncategorized',
              totalCount: 2,
              srLevel0Count: 1,
              srLevel1To3Count: 1,
              srLevel4To6Count: 0,
              srLevel7To8Count: 0,
              srLevel9To10Count: 0,
              wrLevel0Count: 1,
              wrLevel1To3Count: 1,
              wrLevel4To6Count: 0,
              wrLevel7To8Count: 0,
              wrLevel9To10Count: 0,
            },
            {
              categoryName: 'A Category',
              totalCount: 2,
              srLevel0Count: 0,
              srLevel1To3Count: 2,
              srLevel4To6Count: 0,
              srLevel7To8Count: 0,
              srLevel9To10Count: 0,
              wrLevel0Count: 0,
              wrLevel1To3Count: 2,
              wrLevel4To6Count: 0,
              wrLevel7To8Count: 0,
              wrLevel9To10Count: 0,
            },
          ]);
        });

        test('get category name suggestions', async (): Promise<void> => {
          const {
            categoryNames,
          } = await categoryModel.getCategoryNameSuggestions(
            userDb,
            set.setId,
            'A',
            3,
            0
          );
          expect(categoryNames.slice().sort()).toEqual(['A Category']);
        });

        test('return empty if no suggestions found', async (): Promise<
          void
        > => {
          const {
            categoryNames,
          } = await categoryModel.getCategoryNameSuggestions(
            userDb,
            set.setId,
            'transport',
            3,
            0
          );
          expect(categoryNames).toEqual([]);
        });
      });
    });
  });
});
