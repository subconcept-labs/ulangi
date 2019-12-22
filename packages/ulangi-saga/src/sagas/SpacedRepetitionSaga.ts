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
  SessionModel,
  SpacedRepetitionModel,
  VocabularyModel,
} from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import * as moment from 'moment';
import { call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { ModSequenceStrategy } from '../strategies/ModSequenceStrategy';
import { ProtectedSaga } from './ProtectedSaga';

export class SpacedRepetitionSaga extends ProtectedSaga {
  private sequenceStrategy = new ModSequenceStrategy();
  private spacedRepetitionScheduler = new SpacedRepetitionScheduler();

  private sharedDb: SQLiteDatabase;
  private userDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private vocabularyModel: VocabularyModel;
  private spacedRepetitionModel: SpacedRepetitionModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    sharedDb: SQLiteDatabase,
    userDb: SQLiteDatabase,
    sessionModel: SessionModel,
    vocabularyModel: VocabularyModel,
    spacedRepetitionModel: SpacedRepetitionModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.sharedDb = sharedDb;
    this.userDb = userDb;
    this.sessionModel = sessionModel;
    this.vocabularyModel = vocabularyModel;
    this.spacedRepetitionModel = spacedRepetitionModel;
    this.crashlytics = crashlytics;
  }

  public *run(config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowFetchVocabulary],
      config.spacedRepetition.maxLevel,
      config.spacedRepetition.minPerLesson
    );
    yield fork([this, this.allowSaveResult], config.spacedRepetition.maxLevel);
  }

  public *allowFetchVocabulary(
    maxLevel: number,
    minPerLesson: number
  ): IterableIterator<any> {
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

        const termPosition = yield call(
          [this, this.getCurrentTermPosition],
          setId,
          maxLevel
        );

        const orderedLevels = this.sequenceStrategy.getLevelsByTermPosition(
          termPosition,
          maxLevel
        );

        const vocabularyList: Vocabulary[] = yield call(
          [this, this.fetchVocabulary],
          setId,
          initialInterval,
          selectedCategoryNames,
          undefined,
          orderedLevels,
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
            orderedLevels,
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
            errorCode: this.crashlytics.getErrorCode(error),
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
        setId,
        vocabularyList,
        feedbackList,
        autoArchiveSettings,
        incrementTermPosition,
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

        if (incrementTermPosition === true) {
          yield call([this, this.incrementTermPosition], setId, maxLevel);
        }

        yield put(
          createAction(
            ActionType.SPACED_REPETITION__SAVE_RESULT_SUCCEEDED,
            null
          )
        );
      } catch (error) {
        yield put(
          createAction(ActionType.SPACED_REPETITION__SAVE_RESULT_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
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
    orderedLevels: readonly number[],
    limit: number
  ): IterableIterator<any> {
    let vocabularyList: Vocabulary[] = [];

    const levels = orderedLevels.slice();
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

  private *getCurrentTermPosition(
    setId: string,
    maxLevel: number
  ): IterableIterator<any> {
    const termPosition: PromiseType<
      ReturnType<SessionModel['getSpacedRepetitionTermPosition']>
    > = yield call(
      [this.sessionModel, 'getSpacedRepetitionTermPosition'],
      this.sharedDb,
      setId
    );
    // If there is no termPosition, generate a random one
    return termPosition === null ? _.random(0, maxLevel - 1) : termPosition;
  }

  private *incrementTermPosition(
    setId: string,
    maxLevel: number
  ): IterableIterator<any> {
    const termPosition = yield call(
      [this, this.getCurrentTermPosition],
      setId,
      maxLevel
    );

    const nextTermPosition = (termPosition + 1) % maxLevel;

    yield call(
      [this.sharedDb, 'transaction'],
      (tx: Transaction): void => {
        this.sessionModel.upsertSpacedRepetitionTermPosition(
          tx,
          setId,
          nextTermPosition
        );
      }
    );
  }
}
