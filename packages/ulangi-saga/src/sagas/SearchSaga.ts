/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { VocabularyModel } from '@ulangi/ulangi-local-database';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { SearchType } from '../enums/SearchType';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { ProtectedSaga } from './ProtectedSaga';

export class SearchSaga extends ProtectedSaga {
  private searchTask?: Task;

  private userDb: SQLiteDatabase;
  private vocabularyModel: VocabularyModel;

  public constructor(userDb: SQLiteDatabase, vocabularyModel: VocabularyModel) {
    super();
    this.userDb = userDb;
    this.vocabularyModel = vocabularyModel;
  }

  public *run(_: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowPrepareAndClearSearch],
      config.search.searchLimit
    );
  }

  public *allowPrepareAndClearSearch(
    searchLimit: number
  ): IterableIterator<any> {
    this.searchTask = yield fork([this, this.allowPrepareSearch], searchLimit);
    yield fork([this, this.allowClearSearch], searchLimit);
  }

  private *allowClearSearch(searchLimit: number): IterableIterator<any> {
    while (true) {
      yield take(ActionType.SEARCH__CLEAR_SEARCH);
      if (typeof this.searchTask !== 'undefined') {
        yield cancel(this.searchTask);
      }

      // Fork new task
      this.searchTask = yield fork(
        [this, this.allowPrepareSearch],
        searchLimit
      );
    }
  }

  private *allowPrepareSearch(searchLimit: number): IterableIterator<any> {
    try {
      const action: Action<ActionType.SEARCH__PREPARE_SEARCH> = yield take(
        ActionType.SEARCH__PREPARE_SEARCH
      );
      const { setId, searchTerm } = action.payload;

      yield put(createAction(ActionType.SEARCH__PREPARING_SEARCH, null));

      this.searchTask = yield fork(
        [this, this.allowSearch],
        searchLimit,
        setId,
        searchTerm
      );

      yield put(
        createAction(ActionType.SEARCH__PREPARE_SEARCH_SUCCEEDED, null)
      );
    } catch (error) {
      yield put(
        createAction(ActionType.SEARCH__PREPARE_SEARCH_FAILED, {
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
    }
  }

  private *allowSearch(
    searchLimit: number,
    setId: string,
    searchTerm: string
  ): IterableIterator<any> {
    const searchTypes = [
      SearchType.WHOLE_VOCABULARY_TERM,
      SearchType.PREFIXED_VOCABULARY_TERM,
      SearchType.WHOLE_DEFINITION_TERM,
      SearchType.PREFIXED_DEFINITION_TERM,
    ];

    let offset = 0;
    let currentSearchType = searchTypes.shift();
    while (true) {
      yield take(ActionType.SEARCH__SEARCH);

      try {
        yield put(createAction(ActionType.SEARCH__SEARCHING, null));

        let vocabularyList: Vocabulary[] = [];
        while (
          vocabularyList.length < searchLimit &&
          typeof currentSearchType !== 'undefined'
        ) {
          const remain = searchLimit - vocabularyList.length;
          let result: PromiseType<
            ReturnType<
              | VocabularyModel['getVocabularyListBySearchingVocabularyText']
              | VocabularyModel['getVocabularyListBySearchingDefinition']
            >
          >;

          if (currentSearchType === SearchType.WHOLE_VOCABULARY_TERM) {
            result = yield call(
              [
                this.vocabularyModel,
                'getVocabularyListBySearchingVocabularyText',
              ],
              this.userDb,
              setId,
              searchTerm,
              remain,
              offset,
              true
            );
          } else if (
            currentSearchType === SearchType.PREFIXED_VOCABULARY_TERM
          ) {
            const prefixedSearchTerm = searchTerm + '*';
            result = yield call(
              [
                this.vocabularyModel,
                'getVocabularyListBySearchingVocabularyText',
              ],
              this.userDb,
              setId,
              prefixedSearchTerm,
              remain,
              offset,
              true
            );
          } else if (currentSearchType === SearchType.WHOLE_DEFINITION_TERM) {
            result = yield call(
              [this.vocabularyModel, 'getVocabularyListBySearchingDefinition'],
              this.userDb,
              setId,
              searchTerm,
              remain,
              offset,
              true
            );
          } else if (
            currentSearchType === SearchType.PREFIXED_DEFINITION_TERM
          ) {
            const prefixedSearchTerm = searchTerm + '*';
            result = yield call(
              [this.vocabularyModel, 'getVocabularyListBySearchingDefinition'],
              this.userDb,
              setId,
              prefixedSearchTerm,
              remain,
              offset,
              true
            );
          } else {
            throw new Error(`Unknown search SearchType ${currentSearchType}`);
          }

          if (result.vocabularyList.length > 0) {
            offset += remain;
            vocabularyList = vocabularyList.concat(result.vocabularyList);
          } else {
            currentSearchType = searchTypes.shift();
            offset = 0;
          }
        }

        const noMore =
          searchTypes.length === 0 && vocabularyList.length === 0
            ? true
            : false;

        yield put(
          createAction(ActionType.SEARCH__SEARCH_SUCCEEDED, {
            vocabularyList,
            noMore,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.SEARCH__SEARCH_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }
}
