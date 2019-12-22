/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import {
  GetPublicSetCountRequest,
  SearchPublicSetsRequest,
  SearchPublicVocabularyRequest,
} from '@ulangi/ulangi-common/interfaces';
import {
  GetPublicSetCountResponseResolver,
  SearchPublicSetsResponseResolver,
  SearchPublicVocabularyResponseResolver,
} from '@ulangi/ulangi-common/resolvers';
import { SessionModel } from '@ulangi/ulangi-local-database';
import axios from 'axios';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { createRequest } from '../utils/createRequest';
import { ProtectedSaga } from './ProtectedSaga';

export class LibrarySaga extends ProtectedSaga {
  private searchPublicSetsTask?: Task;
  private searchPublicVocabularyTask?: Task;
  private searchPublicSetsResponseResolver = new SearchPublicSetsResponseResolver();
  private searchPublicVocabularyResponseResolver = new SearchPublicVocabularyResponseResolver();
  private getPublicSetCountResponseResolver = new GetPublicSetCountResponseResolver();

  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.crashlytics = crashlytics;
  }

  public *run(config: SagaConfig): IterableIterator<any> {
    yield fork([this, this.allowGetPublicSetCount], config.env.apiUrl);
    yield fork(
      [this, this.allowPrepareAndClearSearchPublicSets],
      config.env.apiUrl,
      config.library.searchPublicSetLimit
    );
    yield fork(
      [this, this.allowPrepareAndClearSearchPublicVocabulary],
      config.env.apiUrl,
      config.library.searchPublicVocabularyLimit
    );
  }

  private *allowGetPublicSetCount(apiUrl: string): IterableIterator<any> {
    while (true) {
      const action: Action<
        ActionType.LIBRARY__GET_PUBLIC_SET_COUNT
      > = yield take(ActionType.LIBRARY__GET_PUBLIC_SET_COUNT);
      try {
        yield put(
          createAction(ActionType.LIBRARY__GETTING_PUBLIC_SET_COUNT, null)
        );

        const result: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const accessToken = assertExists(result);

        const response = yield call(
          [axios, 'request'],
          createRequest<GetPublicSetCountRequest>(
            'get',
            apiUrl,
            '/get-public-set-count',
            {
              languageCodePair: action.payload.languageCodePair,
            },
            null,
            { accessToken }
          )
        );

        const { count } = this.getPublicSetCountResponseResolver.resolve(
          response.data,
          true
        );

        yield put(
          createAction(ActionType.LIBRARY__GET_PUBLIC_SET_COUNT_SUCCEEDED, {
            count,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.LIBRARY__SEARCH_PUBLIC_SETS_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }
  public *allowPrepareAndClearSearchPublicSets(
    apiUrl: string,
    searchLimit: number
  ): IterableIterator<any> {
    this.searchPublicSetsTask = yield fork(
      [this, this.allowPrepareSearchPublicSets],
      apiUrl,
      searchLimit
    );
    yield fork([this, this.allowClearSearchPublicSets], apiUrl, searchLimit);
  }

  private *allowClearSearchPublicSets(
    apiUrl: string,
    searchLimit: number
  ): IterableIterator<any> {
    while (true) {
      yield take(ActionType.LIBRARY__CLEAR_SEARCH_PUBLIC_SETS);
      if (typeof this.searchPublicSetsTask !== 'undefined') {
        yield cancel(this.searchPublicSetsTask);
      }

      this.searchPublicSetsTask = yield fork(
        [this, this.allowPrepareSearchPublicSets],
        apiUrl,
        searchLimit
      );
    }
  }

  private *allowPrepareSearchPublicSets(
    apiUrl: string,
    searchLimit: number
  ): IterableIterator<any> {
    try {
      const action: Action<
        ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_SETS
      > = yield take(ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_SETS);
      const { languageCodePair, searchTerm } = action.payload;

      const curatedOnly = searchTerm === '' ? true : false;
      yield put(
        createAction(ActionType.LIBRARY__PREPARING_SEARCH_PUBLIC_SETS, null)
      );
      yield fork(
        [this, this.allowSearchPublicSets],
        apiUrl,
        languageCodePair,
        searchTerm,
        searchLimit,
        curatedOnly
      );
      yield put(
        createAction(
          ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_SETS_SUCCEEDED,
          null
        )
      );
    } catch (error) {
      console.warn(error);
    }
  }

  private *allowSearchPublicSets(
    apiUrl: string,
    languageCodePair: string,
    searchTerm: string,
    searchLimit: number,
    curatedOnly: boolean
  ): IterableIterator<any> {
    let offset = 0;
    let noMore = false;
    while (noMore === false) {
      yield take(ActionType.LIBRARY__SEARCH_PUBLIC_SETS);
      try {
        yield put(
          createAction(ActionType.LIBRARY__SEARCHING_PUBLIC_SETS, null)
        );

        const result: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const accessToken = assertExists(result);

        const response = yield call(
          [axios, 'request'],
          createRequest<SearchPublicSetsRequest>(
            'get',
            apiUrl,
            '/search-public-sets',
            {
              languageCodePair,
              searchTerm,
              limit: searchLimit,
              offset,
              curatedOnly,
            },
            null,
            { accessToken }
          )
        );

        const {
          setList,
          nextOffset,
        } = this.searchPublicSetsResponseResolver.resolve(response.data, true);
        noMore = nextOffset === null;
        offset = nextOffset === null ? 0 : nextOffset;
        yield put(
          createAction(ActionType.LIBRARY__SEARCH_PUBLIC_SETS_SUCCEEDED, {
            setList,
            noMore,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.LIBRARY__SEARCH_PUBLIC_SETS_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowPrepareAndClearSearchPublicVocabulary(
    apiUrl: string,
    searchLimit: number
  ): IterableIterator<any> {
    this.searchPublicVocabularyTask = yield fork(
      [this, this.allowPrepareSearchPublicVocabulary],
      apiUrl,
      searchLimit
    );
    yield fork(
      [this, this.allowClearSearchPublicVocabulary],
      apiUrl,
      searchLimit
    );
  }

  private *allowClearSearchPublicVocabulary(
    apiUrl: string,
    searchLimit: number
  ): IterableIterator<any> {
    while (true) {
      yield take(ActionType.LIBRARY__CLEAR_SEARCH_PUBLIC_VOCABULARY);
      if (typeof this.searchPublicVocabularyTask !== 'undefined') {
        yield cancel(this.searchPublicVocabularyTask);
      }

      this.searchPublicVocabularyTask = yield fork(
        [this, this.allowPrepareSearchPublicVocabulary],
        apiUrl,
        searchLimit
      );
    }
  }

  private *allowPrepareSearchPublicVocabulary(
    apiUrl: string,
    searchLimit: number
  ): IterableIterator<any> {
    try {
      const action: Action<
        ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_VOCABULARY
      > = yield take(ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_VOCABULARY);
      const { languageCodePair, searchTerm } = action.payload;

      yield put(
        createAction(
          ActionType.LIBRARY__PREPARING_SEARCH_PUBLIC_VOCABULARY,
          null
        )
      );
      yield fork(
        [this, this.allowSearchPublicVocabulary],
        apiUrl,
        languageCodePair,
        searchTerm,
        searchLimit
      );
      yield put(
        createAction(
          ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_VOCABULARY_SUCCEEDED,
          null
        )
      );
    } catch (error) {
      console.warn(error);
    }
  }

  private *allowSearchPublicVocabulary(
    apiUrl: string,
    languageCodePair: string,
    searchTerm: string,
    searchLimit: number
  ): IterableIterator<any> {
    let offset = 0;
    let noMore = false;
    while (noMore === false) {
      yield take(ActionType.LIBRARY__SEARCH_PUBLIC_VOCABULARY);
      try {
        yield put(
          createAction(ActionType.LIBRARY__SEARCHING_PUBLIC_VOCABULARY, null)
        );
        const result: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const accessToken = assertExists(result);

        const response = yield call(
          [axios, 'request'],
          createRequest<SearchPublicVocabularyRequest>(
            'get',
            apiUrl,
            '/search-public-vocabulary',
            {
              languageCodePair,
              searchTerm,
              limit: searchLimit,
              offset,
            },
            null,
            { accessToken }
          )
        );

        const {
          vocabularyList,
          nextOffset,
        } = this.searchPublicVocabularyResponseResolver.resolve(
          response.data,
          true
        );
        noMore = nextOffset === null;
        offset = nextOffset === null ? 0 : nextOffset;
        yield put(
          createAction(ActionType.LIBRARY__SEARCH_PUBLIC_VOCABULARY_SUCCEEDED, {
            vocabularyList,
            noMore,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.LIBRARY__SEARCH_PUBLIC_VOCABULARY_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }
}
