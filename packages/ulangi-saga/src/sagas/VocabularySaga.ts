/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ErrorCode,
  VocabularyDueType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  SpacedRepetitionModel,
  VocabularyModel,
  WritingModel,
} from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { ProtectedSaga } from './ProtectedSaga';

export class VocabularySaga extends ProtectedSaga {
  private fetchTask?: Task;
  private userDb: SQLiteDatabase;
  private vocabularyModel: VocabularyModel;
  private spacedRepetitionModel: SpacedRepetitionModel;
  private writingModel: WritingModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    vocabularyModel: VocabularyModel,
    spacedRepetitionModel: SpacedRepetitionModel,
    writingModel: WritingModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.userDb = userDb;
    this.vocabularyModel = vocabularyModel;
    this.spacedRepetitionModel = spacedRepetitionModel;
    this.writingModel = writingModel;
    this.crashlytics = crashlytics;
  }

  public *run(config: SagaConfig): IterableIterator<any> {
    yield fork([this, this.allowAdd]);
    yield fork([this, this.allowAddMultiple]);
    yield fork([this, this.allowEdit]);
    yield fork([this, this.allowEditMultiple]);
    yield fork(
      [this, this.allowPrepareAndClearFetch],
      config.vocabulary.fetchLimit,
      config.spacedRepetition.maxLevel,
      config.writing.maxLevel
    );
  }

  public *allowAdd(): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.VOCABULARY__ADD> = yield take(
        ActionType.VOCABULARY__ADD
      );
      const { setId, vocabulary } = action.payload;

      try {
        if (vocabulary.definitions.length === 0) {
          throw new Error(ErrorCode.VOCABULARY__NO_DEFINITIONS);
        } else {
          yield put(
            createAction(ActionType.VOCABULARY__ADDING, { vocabulary })
          );

          yield call(
            [this.userDb, 'transaction'],
            (tx: Transaction): void => {
              this.vocabularyModel.insertVocabulary(
                tx,
                vocabulary,
                setId,
                'local'
              );
            }
          );

          yield put(
            createAction(ActionType.VOCABULARY__ADD_SUCCEEDED, { vocabulary })
          );
        }
      } catch (error) {
        yield put(
          createAction(ActionType.VOCABULARY__ADD_FAILED, {
            vocabulary,
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowAddMultiple(): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.VOCABULARY__ADD_MULTIPLE> = yield take(
        ActionType.VOCABULARY__ADD_MULTIPLE
      );
      const { setId, vocabularyList } = action.payload;

      try {
        yield put(
          createAction(ActionType.VOCABULARY__ADDING_MULTIPLE, {
            vocabularyList,
          })
        );

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.vocabularyModel.insertMultipleVocabulary(
              tx,
              vocabularyList.map(
                (vocabulary): [Vocabulary, string] => [vocabulary, setId]
              ),
              'local'
            );
          }
        );

        yield put(
          createAction(ActionType.VOCABULARY__ADD_MULTIPLE_SUCCEEDED, {
            vocabularyList,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.VOCABULARY__ADD_MULTIPLE_FAILED, {
            vocabularyList,
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowEdit(): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.VOCABULARY__EDIT> = yield take(
        ActionType.VOCABULARY__EDIT
      );
      const { vocabulary, setId } = action.payload;

      try {
        yield put(createAction(ActionType.VOCABULARY__EDITING, { vocabulary }));

        const vocabularyId = assertExists(
          vocabulary.vocabularyId,
          'vocabularyId should not be null or undefined'
        );

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.vocabularyModel.updateVocabulary(
              tx,
              vocabulary,
              setId,
              'local'
            );
          }
        );

        const result: PromiseType<
          ReturnType<VocabularyModel['getVocabularyById']>
        > = yield call(
          [this.vocabularyModel, 'getVocabularyById'],
          this.userDb,
          vocabularyId,
          true
        );

        const { vocabulary: updatedVocabulary } = assertExists(result);
        yield put(
          createAction(ActionType.VOCABULARY__EDIT_SUCCEEDED, {
            vocabulary: updatedVocabulary,
            setId,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.VOCABULARY__EDIT_FAILED, {
            vocabulary,
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowEditMultiple(): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.VOCABULARY__EDIT_MULTIPLE> = yield take(
        ActionType.VOCABULARY__EDIT_MULTIPLE
      );
      const { vocabularyList, vocabularyIdSetIdPairs } = action.payload;

      try {
        yield put(
          createAction(ActionType.VOCABULARY__EDITING_MULTIPLE, {
            vocabularyList,
          })
        );

        const vocabularyIdSetIdMap = _.fromPairs(vocabularyIdSetIdPairs);

        const existingVocabularyIds = vocabularyList.map(
          (vocabulary): string => {
            return assertExists(vocabulary.vocabularyId);
          }
        );

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.vocabularyModel.insertMultipleVocabulary(
              tx,
              vocabularyList
                .filter(
                  (vocabulary): boolean => {
                    return !_.includes(
                      existingVocabularyIds,
                      vocabulary.vocabularyId
                    );
                  }
                )
                .map(
                  (vocabulary): [Vocabulary, string] => {
                    return [
                      vocabulary as Vocabulary,
                      vocabularyIdSetIdMap[
                        assertExists(vocabulary.vocabularyId)
                      ],
                    ];
                  }
                ),
              'local'
            );
            this.vocabularyModel.updateMultipleVocabulary(
              tx,
              vocabularyList
                .filter(
                  (vocabulary): boolean => {
                    return _.includes(
                      existingVocabularyIds,
                      vocabulary.vocabularyId
                    );
                  }
                )
                .map(
                  (vocabulary): [DeepPartial<Vocabulary>, string] => {
                    return [
                      vocabulary,
                      vocabularyIdSetIdMap[
                        assertExists(vocabulary.vocabularyId)
                      ],
                    ];
                  }
                ),
              'local'
            );
          }
        );

        yield put(
          createAction(ActionType.VOCABULARY__EDIT_MULTIPLE_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.VOCABULARY__EDIT_MULTIPLE_FAILED, {
            vocabularyList,
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowPrepareAndClearFetch(
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    this.fetchTask = yield fork(
      [this, this.allowPrepareFetchVocabulary],
      limit,
      spacedRepetitionMaxLevel,
      writingMaxLevel
    );
    yield fork(
      [this, this.allowClearFetchVocabulary],
      limit,
      spacedRepetitionMaxLevel,
      writingMaxLevel
    );
  }

  private *allowClearFetchVocabulary(
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    while (true) {
      yield take(ActionType.VOCABULARY__CLEAR_FETCH);
      if (typeof this.fetchTask !== 'undefined') {
        yield cancel(this.fetchTask);
      }

      this.fetchTask = yield fork(
        [this, this.allowPrepareFetchVocabulary],
        limit,
        spacedRepetitionMaxLevel,
        writingMaxLevel
      );
    }
  }

  private *allowPrepareFetchVocabulary(
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    try {
      const action: Action<ActionType.VOCABULARY__PREPARE_FETCH> = yield take(
        ActionType.VOCABULARY__PREPARE_FETCH
      );

      yield put(createAction(ActionType.VOCABULARY__PREPARING_FETCH, null));

      yield fork(
        [this, this.allowFetchVocabulary],
        action.payload,
        limit,
        spacedRepetitionMaxLevel,
        writingMaxLevel
      );

      yield put(
        createAction(ActionType.VOCABULARY__PREPARE_FETCH_SUCCEEDED, null)
      );
    } catch (error) {
      yield put(
        createAction(ActionType.VOCABULARY__PREPARE_FETCH_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }

  private *allowFetchVocabulary(
    payload:
      | {
          filterBy: 'VocabularyStatus';
          setId: string;
          vocabularyStatus: VocabularyStatus;
          categoryName?: string;
        }
      | {
          filterBy: 'VocabularyDueType';
          setId: string;
          initialInterval: number;
          dueType: VocabularyDueType;
          categoryName?: string;
        },
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    let offset = 0;
    while (true) {
      yield take(ActionType.VOCABULARY__FETCH);
      try {
        yield put(createAction(ActionType.VOCABULARY__FETCHING, null));

        let result: PromiseType<
          ReturnType<
            | VocabularyModel['getVocabularyList']
            | SpacedRepetitionModel['getDueVocabularyList']
            | WritingModel['getDueVocabularyList']
          >
        >;
        if (payload.filterBy === 'VocabularyStatus') {
          const { setId, vocabularyStatus, categoryName } = payload;

          result = yield call(
            [this.vocabularyModel, 'getVocabularyList'],
            this.userDb,
            setId,
            vocabularyStatus,
            typeof categoryName !== 'undefined' ? [categoryName] : undefined,
            limit,
            offset,
            true
          );
        } else {
          const { setId, initialInterval, dueType, categoryName } = payload;

          if (dueType === VocabularyDueType.DUE_BY_SPACED_REPETITION) {
            result = yield call(
              [this.spacedRepetitionModel, 'getDueVocabularyList'],
              this.userDb,
              setId,
              initialInterval,
              spacedRepetitionMaxLevel,
              typeof categoryName !== 'undefined' ? [categoryName] : undefined,
              limit,
              offset,
              true
            );
          } else if (dueType === VocabularyDueType.DUE_BY_WRITING) {
            result = yield call(
              [this.writingModel, 'getDueVocabularyList'],
              this.userDb,
              setId,
              initialInterval,
              writingMaxLevel,
              typeof categoryName !== 'undefined' ? [categoryName] : undefined,
              limit,
              offset,
              true
            );
          } else {
            throw new Error('Unsupported due type');
          }
        }

        const { vocabularyList } = result;
        offset = vocabularyList.length + offset;

        let noMore = false;
        if (vocabularyList.length === 0) {
          noMore = true;
        }

        yield put(
          createAction(ActionType.VOCABULARY__FETCH_SUCCEEDED, {
            vocabularyList,
            noMore,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.VOCABULARY__FETCH_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }
}
