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
import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import {
  ErrorCode,
  VocabularyDueType,
  VocabularySortType,
} from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { VocabularyFilterCondition } from '@ulangi/ulangi-common/types';
import {
  SpacedRepetitionModel,
  VocabularyLocalDataModel,
  VocabularyModel,
  WritingModel,
} from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import { SagaIterator, Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { ProtectedSaga } from './ProtectedSaga';

export class VocabularySaga extends ProtectedSaga {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  private fetchTask?: Task;
  private userDb: SQLiteDatabase;
  private vocabularyModel: VocabularyModel;
  private vocabularyLocalDataModel: VocabularyLocalDataModel;
  private spacedRepetitionModel: SpacedRepetitionModel;
  private writingModel: WritingModel;

  public constructor(
    userDb: SQLiteDatabase,
    vocabularyModel: VocabularyModel,
    vocabularyLocalDataModel: VocabularyLocalDataModel,
    spacedRepetitionModel: SpacedRepetitionModel,
    writingModel: WritingModel
  ) {
    super();
    this.userDb = userDb;
    this.vocabularyModel = vocabularyModel;
    this.vocabularyLocalDataModel = vocabularyLocalDataModel;
    this.spacedRepetitionModel = spacedRepetitionModel;
    this.writingModel = writingModel;
  }

  public *run(_: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork([this, this.allowAdd]);
    yield fork([this, this.allowAddMultiple]);
    yield fork([this, this.allowEdit]);
    yield fork([this, this.allowEditMultiple]);
    yield fork(
      [this, this.allowBulkEdit],
      config.spacedRepetition.maxLevel,
      config.writing.maxLevel
    );
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
      const { setId, vocabulary, checkDuplicate } = action.payload;

      try {
        if (vocabulary.definitions.length === 0) {
          throw new Error(ErrorCode.VOCABULARY__NO_DEFINITIONS);
        } else {
          yield put(
            createAction(ActionType.VOCABULARY__ADDING, { vocabulary })
          );

          const vocabularyTerm = this.vocabularyExtraFieldParser.parse(
            vocabulary.vocabularyText
          ).vocabularyTerm;

          if (checkDuplicate === true) {
            const existingVocabularyTerms = yield call(
              [this.vocabularyLocalDataModel, 'vocabularyTermsExist'],
              this.userDb,
              [vocabularyTerm]
            );

            if (_.includes(existingVocabularyTerms, vocabularyTerm)) {
              throw new Error(ErrorCode.VOCABULARY__DUPLICATE_TERM);
            }
          }

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
            errorCode: errorConverter.getErrorCode(error),
            error,
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
      const { setId, vocabularyList, ignoreDuplicates } = action.payload;

      try {
        yield put(
          createAction(ActionType.VOCABULARY__ADDING_MULTIPLE, {
            vocabularyList,
          })
        );

        let vocabularyListToInsert: readonly Vocabulary[] = vocabularyList;

        if (ignoreDuplicates === true) {
          const existingVocabularyTerms = yield call(
            [this.vocabularyLocalDataModel, 'vocabularyTermsExist'],
            this.userDb,
            vocabularyList.map(
              (vocabulary): string => {
                return this.vocabularyExtraFieldParser.parse(
                  vocabulary.vocabularyText
                ).vocabularyTerm;
              }
            )
          );

          vocabularyListToInsert = vocabularyList.filter(
            (vocabulary): boolean => {
              return !_.includes(
                existingVocabularyTerms,
                this.vocabularyExtraFieldParser.parse(vocabulary.vocabularyText)
                  .vocabularyTerm
              );
            }
          );
        }

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.vocabularyModel.insertMultipleVocabulary(
              tx,
              vocabularyListToInsert.map(
                (vocabulary): [Vocabulary, string] => [vocabulary, setId]
              ),
              'local'
            );
          }
        );

        yield put(
          createAction(ActionType.VOCABULARY__ADD_MULTIPLE_SUCCEEDED, {
            vocabularyList: vocabularyListToInsert,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.VOCABULARY__ADD_MULTIPLE_FAILED, {
            vocabularyList,
            errorCode: errorConverter.getErrorCode(error),
            error,
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
            errorCode: errorConverter.getErrorCode(error),
            error,
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
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowBulkEdit(
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.VOCABULARY__BULK_EDIT> = yield take(
        ActionType.VOCABULARY__BULK_EDIT
      );
      const { filterCondition, edit } = action.payload;

      try {
        let updatedCount = 0;

        yield put(
          createAction(ActionType.VOCABULARY__BULK_EDITING, {
            updatedCount,
          })
        );

        let done = false;
        while (!done) {
          if (
            edit.type === 'moveToSet' &&
            filterCondition.setId === edit.newSetId
          ) {
            done = true;
          } else if (
            edit.type === 'changeStatus' &&
            filterCondition.filterBy === 'VocabularyStatus' &&
            filterCondition.vocabularyStatus === edit.newVocabularyStatus
          ) {
            done = true;
          } else if (
            edit.type === 'recategorize' &&
            _.difference(filterCondition.categoryNames, [edit.newCategoryName])
              .length === 0
          ) {
            done = true;
          } else {
            const result: {
              vocabularyList: readonly Vocabulary[];
            } = yield call(
              [this, this.getVocabularyListByFilterType],
              {
                ...filterCondition,
                categoryNames:
                  edit.type === 'recategorize'
                    ? _.difference(
                        filterCondition.categoryNames,
                        edit.newCategoryName
                      )
                    : filterCondition.categoryNames,
              },
              VocabularySortType.UNSORTED,
              100,
              0,
              spacedRepetitionMaxLevel,
              writingMaxLevel
            );

            const { vocabularyList } = result;

            updatedCount += vocabularyList.length;

            yield put(
              createAction(ActionType.VOCABULARY__BULK_EDITING, {
                updatedCount,
              })
            );

            yield call(
              [this.userDb, 'transaction'],
              (tx: Transaction): void => {
                this.vocabularyModel.updateMultipleVocabulary(
                  tx,
                  vocabularyList.map(
                    (
                      vocabulary
                    ): [DeepPartial<Vocabulary>, undefined | string] => {
                      const vocabularyId = vocabulary.vocabularyId;
                      if (edit.type === 'moveToSet') {
                        return [{ vocabularyId }, edit.newSetId];
                      } else if (edit.type === 'changeStatus') {
                        return [
                          {
                            vocabularyId,
                            vocabularyStatus: edit.newVocabularyStatus,
                          },
                          undefined,
                        ];
                      } else if (edit.type === 'recategorize') {
                        return [
                          {
                            vocabularyId,
                            category: {
                              categoryName: edit.newCategoryName,
                            },
                          },
                          undefined,
                        ];
                      } else {
                        throw new Error('Unknown bulk action.');
                      }
                    }
                  ),
                  'local'
                );
              }
            );

            done = vocabularyList.length === 0;
          }
        }

        yield put(
          createAction(ActionType.VOCABULARY__BULK_EDIT_SUCCEEDED, {
            totalCount: updatedCount,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.VOCABULARY__BULK_EDIT_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
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
        action.payload.filterCondition,
        action.payload.sortType,
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
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
    }
  }

  private *allowFetchVocabulary(
    filterCondition: VocabularyFilterCondition,
    sortType: VocabularySortType,
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    let offset = 0;
    while (true) {
      yield take(ActionType.VOCABULARY__FETCH);
      try {
        yield put(createAction(ActionType.VOCABULARY__FETCHING, null));

        const result = yield call(
          [this, this.getVocabularyListByFilterType],
          filterCondition,
          sortType,
          limit,
          offset,
          spacedRepetitionMaxLevel,
          writingMaxLevel
        );

        const { vocabularyList } = result;
        offset += limit;

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
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  protected *getVocabularyListByFilterType(
    filterCondition: VocabularyFilterCondition,
    sortType: VocabularySortType,
    limit: number,
    offset: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): SagaIterator<
    PromiseType<
      ReturnType<
        | VocabularyModel['getVocabularyList']
        | SpacedRepetitionModel['getDueVocabularyList']
        | WritingModel['getDueVocabularyList']
      >
    >
  > {
    let result: PromiseType<
      ReturnType<
        | VocabularyModel['getVocabularyList']
        | SpacedRepetitionModel['getDueVocabularyList']
        | WritingModel['getDueVocabularyList']
      >
    >;
    if (filterCondition.filterBy === 'VocabularyStatus') {
      const { setId, vocabularyStatus, categoryNames } = filterCondition;

      result = yield call(
        [this.vocabularyModel, 'getVocabularyList'],
        this.userDb,
        setId,
        vocabularyStatus,
        typeof categoryNames !== 'undefined' ? categoryNames : undefined,
        sortType,
        limit,
        offset,
        true
      );
    } else {
      const {
        setId,
        initialInterval,
        dueType,
        categoryNames,
      } = filterCondition;

      if (dueType === VocabularyDueType.DUE_BY_SPACED_REPETITION) {
        result = yield call(
          [this.spacedRepetitionModel, 'getDueVocabularyList'],
          this.userDb,
          setId,
          initialInterval,
          spacedRepetitionMaxLevel,
          typeof categoryNames !== 'undefined' ? categoryNames : undefined,
          sortType,
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
          typeof categoryNames !== 'undefined' ? categoryNames : undefined,
          sortType,
          limit,
          offset,
          true
        );
      } else {
        throw new Error('Unsupported due type');
      }
    }

    return result;
  }
}
