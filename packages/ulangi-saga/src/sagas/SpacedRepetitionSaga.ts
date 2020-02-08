/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepMutable, DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { SpacedRepetitionScheduler } from '@ulangi/ulangi-common/core';
import { ErrorCode, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  SpacedRepetitionModel,
  VocabularyModel,
} from '@ulangi/ulangi-local-database';
import * as moment from 'moment';
import { call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { LevelSequenceStrategy } from '../strategies/LevelSequenceStrategy';
import { ProtectedSaga } from './ProtectedSaga';

export class SpacedRepetitionSaga extends ProtectedSaga {
  private sequenceStrategy = new LevelSequenceStrategy();
  private spacedRepetitionScheduler = new SpacedRepetitionScheduler();

  private userDb: SQLiteDatabase;
  private vocabularyModel: VocabularyModel;
  private spacedRepetitionModel: SpacedRepetitionModel;

  public constructor(
    userDb: SQLiteDatabase,
    vocabularyModel: VocabularyModel,
    spacedRepetitionModel: SpacedRepetitionModel
  ) {
    super();
    this.userDb = userDb;
    this.vocabularyModel = vocabularyModel;
    this.spacedRepetitionModel = spacedRepetitionModel;
  }

  public *run(_: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowFetchVocabulary],
      config.spacedRepetition.minPerLesson
    );
    yield fork([this, this.allowSaveResult], config.spacedRepetition.maxLevel);
  }

  public *allowFetchVocabulary(minPerLesson: number): IterableIterator<any> {
    while (true) {
      const action: Action<
        ActionType.SPACED_REPETITION__FETCH_VOCABULARY
      > = yield take(ActionType.SPACED_REPETITION__FETCH_VOCABULARY);
      const {
        setId,
        initialInterval,
        limit,
        selectedCategoryNames,
        includeFromOtherCategories,
      } = action.payload;

      try {
        yield put(
          createAction(ActionType.SPACED_REPETITION__FETCHING_VOCABULARY, {
            setId,
          })
        );

        const levelSequence = this.sequenceStrategy.getLevelSequence(
          'PRIORITIZE_LEARNED_TERMS'
        );

        const vocabularyList: Vocabulary[] = yield call(
          [this, this.fetchVocabulary],
          setId,
          initialInterval,
          selectedCategoryNames,
          undefined,
          levelSequence,
          limit
        );

        // Not enough terms for selected categories
        if (
          vocabularyList.length < minPerLesson &&
          typeof selectedCategoryNames !== 'undefined' &&
          includeFromOtherCategories === true
        ) {
          const newList = yield call(
            [this, this.fetchVocabulary],
            setId,
            initialInterval,
            undefined,
            selectedCategoryNames, // exclude selected categories
            levelSequence,
            limit
          );
          vocabularyList.push(...newList);
        }

        if (vocabularyList.length < minPerLesson) {
          throw new Error(ErrorCode.SPACED_REPETITION__INSUFFICIENT_VOCABULARY);
        } else {
          yield put(
            createAction(
              ActionType.SPACED_REPETITION__FETCH_VOCABULARY_SUCCEEDED,
              {
                setId,
                vocabularyList,
              }
            )
          );
        }
      } catch (error) {
        yield put(
          createAction(ActionType.SPACED_REPETITION__FETCH_VOCABULARY_FAILED, {
            setId,
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowSaveResult(maxLevel: number): IterableIterator<any> {
    while (true) {
      const action: Action<
        ActionType.SPACED_REPETITION__SAVE_RESULT
      > = yield take(ActionType.SPACED_REPETITION__SAVE_RESULT);
      const {
        vocabularyList,
        feedbackList,
        autoArchiveSettings,
      } = action.payload;

      try {
        yield put(
          createAction(ActionType.SPACED_REPETITION__SAVING_RESULT, null)
        );

        const editedVocabularyList = Array.from(feedbackList.entries()).map(
          ([vocabularyId, feedback]): DeepPartial<Vocabulary> => {
            const vocabulary = assertExists(vocabularyList.get(vocabularyId));

            const editedVocabulary: DeepMutable<DeepPartial<Vocabulary>> = {
              vocabularyId: vocabulary.vocabularyId,
              lastLearnedAt: moment().toDate(),
              level: this.spacedRepetitionScheduler.getNextLevel(
                vocabulary,
                feedback,
                maxLevel
              ),
            };

            if (
              this.spacedRepetitionScheduler.willBeArchived(
                vocabulary,
                feedback,
                maxLevel,
                autoArchiveSettings
              )
            ) {
              editedVocabulary.vocabularyStatus = VocabularyStatus.ARCHIVED;
            }

            return editedVocabulary;
          }
        );

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.vocabularyModel.updateMultipleVocabulary(
              tx,
              editedVocabularyList.map(
                (vocabulary): [DeepPartial<Vocabulary>, undefined] => [
                  vocabulary,
                  undefined,
                ]
              ),
              'local'
            );
          }
        );

        yield put(
          createAction(
            ActionType.SPACED_REPETITION__SAVE_RESULT_SUCCEEDED,
            null
          )
        );
      } catch (error) {
        yield put(
          createAction(ActionType.SPACED_REPETITION__SAVE_RESULT_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  private *fetchVocabulary(
    setId: string,
    initialInterval: number,
    selectedCategoryNames: undefined | string[],
    excludedCategoryNames: undefined | string[],
    levelSequence: readonly number[],
    limit: number
  ): IterableIterator<any> {
    let vocabularyList: Vocabulary[] = [];

    const levels = levelSequence.slice();
    // Fetch vocabulary by each level in order until the limit is reached
    while (levels.length > 0 && vocabularyList.length < limit) {
      const currentLevel = assertExists(levels.shift());
      const remain = limit - vocabularyList.length;

      const result: PromiseType<
        ReturnType<SpacedRepetitionModel['getDueVocabularyListByLevel']>
      > = yield call(
        [this.spacedRepetitionModel, 'getDueVocabularyListByLevel'],
        this.userDb,
        setId,
        currentLevel,
        initialInterval,
        remain,
        true,
        selectedCategoryNames,
        excludedCategoryNames
      );

      let { vocabularyList: newList } = result;

      // Filter out vocabulary that does not have any definitions
      newList = newList.filter(
        (vocabulary: Vocabulary): boolean => vocabulary.definitions.length !== 0
      );

      vocabularyList = vocabularyList.concat(newList);
    }

    return vocabularyList;
  }
}
