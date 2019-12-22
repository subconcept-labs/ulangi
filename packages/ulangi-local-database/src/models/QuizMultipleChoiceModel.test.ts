/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
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
import { QuizMultipleChoiceModel } from './QuizMultipleChoiceModel';
import { SetModel } from './SetModel';
import { VocabularyModel } from './VocabularyModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('QuizMultipleChoiceModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let mockedDatabaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let setModel: SetModel;
    let vocabularyModel: VocabularyModel;
    let quizMultipleChoiceModel: QuizMultipleChoiceModel;
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
        quizMultipleChoiceModel = modelFactory.createModel(
          'quizMultipleChoiceModel'
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

      describe('Tests start after inserting terms from local', (): void => {
        let vocabularyList: Vocabulary[];

        beforeEach(
          async (): Promise<void> => {
            vocabularyList = [
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                writing: {
                  disabled: false,
                  level: 1,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 2,
                writing: {
                  disabled: false,
                  level: 2,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 0,
                writing: {
                  disabled: false,
                  level: 0,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                writing: {
                  disabled: true,
                  level: 1,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.DELETED,
                vocabularyText: 'vocabulary',
                level: 1,
                writing: {
                  disabled: false,
                  level: 1,
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 1,
                writing: {
                  disabled: false,
                  level: 1,
                },
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 2,
                writing: {
                  disabled: false,
                  level: 2,
                },
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary',
                level: 0,
                writing: {
                  disabled: false,
                  level: 0,
                },
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary10',
                level: 1,
                writing: {
                  disabled: true,
                  level: 1,
                },
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.DELETED,
                vocabularyText: 'vocabulary11',
                level: 1,
                writing: {
                  disabled: false,
                  level: 1,
                },
                category: {
                  categoryName: 'category1',
                },
              }),
              new VocabularyBuilder().build({
                vocabularyStatus: VocabularyStatus.ACTIVE,
                vocabularyText: 'vocabulary12',
                category: {
                  categoryName: 'category1',
                },
              }),
            ];

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
          }
        );

        test('get learned vocabulary for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'learned',
              startRange,
              endRange,
              true,
              undefined,
              undefined
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 1
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });

        test('get learned vocabulary with selected categories for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'learned',
              startRange,
              endRange,
              true,
              ['category1'],
              undefined
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 1 &&
              vocabulary.category &&
              vocabulary.category.categoryName === 'category1'
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });

        test('get learned vocabulary with Uncategorized for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'learned',
              startRange,
              endRange,
              true,
              ['Uncategorized'],
              undefined
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 1 &&
              (typeof vocabulary.category === 'undefined' ||
                vocabulary.category.categoryName === 'Uncategorized')
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });

        test('get learned vocabulary with excluded categories for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'learned',
              startRange,
              endRange,
              true,
              undefined,
              ['category1']
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 1 &&
              (typeof vocabulary.category === 'undefined' ||
                vocabulary.category.categoryName !== 'category1')
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });

        test('get learned vocabulary excluding Uncategorized for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'learned',
              startRange,
              endRange,
              true,
              undefined,
              ['Uncategorized']
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 1 &&
              typeof vocabulary.category !== 'undefined' &&
              vocabulary.category.categoryName !== 'Uncategorized'
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });

        test('get active vocabulary for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'active',
              startRange,
              endRange,
              true,
              undefined,
              undefined
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 0
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });

        test('get active vocabulary with selected categories for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'active',
              startRange,
              endRange,
              true,
              ['category1'],
              undefined
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 0 &&
              vocabulary.category &&
              vocabulary.category.categoryName === 'category1'
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });

        test('get active vocabulary with Uncategorized for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'active',
              startRange,
              endRange,
              true,
              ['Uncategorized'],
              undefined
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 0 &&
              (typeof vocabulary.category === 'undefined' ||
                vocabulary.category.categoryName === 'Uncategorized')
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });

        test('get active vocabulary with excluded categories for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'active',
              startRange,
              endRange,
              true,
              undefined,
              ['category1']
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 0 &&
              (typeof vocabulary.category === 'undefined' ||
                vocabulary.category.categoryName !== 'category1')
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });

        test('get active vocabulary excluding Uncategorized for multiple choice quiz', async (): Promise<
          void
        > => {
          let startRange = 1;
          for (const vocabulary of vocabularyList) {
            const endRange = startRange;
            const result = await quizMultipleChoiceModel.getVocabularyForMultipleChoiceQuiz(
              userDb,
              setList[0].setId,
              'active',
              startRange,
              endRange,
              true,
              undefined,
              ['Uncategorized']
            );

            if (
              vocabulary.vocabularyStatus === VocabularyStatus.ACTIVE &&
              vocabulary.level >= 0 &&
              typeof vocabulary.category !== 'undefined' &&
              vocabulary.category.categoryName !== 'Uncategorized'
            ) {
              expect(assertExists(result).vocabularyLocalIdPair[0]).toEqual(
                vocabulary
              );
            } else {
              expect(result).toEqual(null);
            }
            startRange++;
          }
        });
      });
    });
  });
});
