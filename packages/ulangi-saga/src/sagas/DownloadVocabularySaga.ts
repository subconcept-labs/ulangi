/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { currentComparableCommonVersion } from '@ulangi/ulangi-common';
import {
  DownloadVocabularyRequest,
  Vocabulary,
} from '@ulangi/ulangi-common/interfaces';
import {
  DownloadVocabularyResponseResolver,
  VocabularyResolver,
} from '@ulangi/ulangi-common/resolvers';
import {
  IncompatibleVocabularyModel,
  SessionModel,
  VocabularyModel,
} from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import * as _ from 'lodash';
import { call, delay, put } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { createRequest } from '../utils/createRequest';

export class DownloadVocabularySaga {
  private vocabularyResolver = new VocabularyResolver();
  private downloadVocabularyResponseResolver = new DownloadVocabularyResponseResolver();

  private userDb: SQLiteDatabase;
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private vocabularyModel: VocabularyModel;
  private incompatibleVocabularyModel: IncompatibleVocabularyModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    vocabularyModel: VocabularyModel,
    incompatibleVocabularyModel: IncompatibleVocabularyModel,
    crashlytics: CrashlyticsAdapter
  ) {
    this.userDb = userDb;
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.vocabularyModel = vocabularyModel;
    this.incompatibleVocabularyModel = incompatibleVocabularyModel;
    this.crashlytics = crashlytics;
  }

  public *downloadVocabulary(
    apiUrl: string,
    downloadLimit: number,
    transactionChunkSize: number,
    delayBetweenChunks: number
  ): IterableIterator<any> {
    let success, noMore;
    try {
      const latestSyncedTime: PromiseType<
        ReturnType<VocabularyModel['getLatestSyncTime']>
      > = yield call([this.vocabularyModel, 'getLatestSyncTime'], this.userDb);

      yield put(
        createAction(ActionType.VOCABULARY__DOWNLOADING_VOCABULARY, {
          startAt: latestSyncedTime,
        })
      );

      const accessToken: PromiseType<
        ReturnType<SessionModel['getAccessToken']>
      > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

      const response: AxiosResponse<any> = yield call(
        [axios, 'request'],
        createRequest<DownloadVocabularyRequest>(
          'get',
          apiUrl,
          '/download-vocabulary',
          {
            startAt: latestSyncedTime === null ? undefined : latestSyncedTime,
            softLimit: downloadLimit,
          },
          null,
          { accessToken: assertExists(accessToken) }
        )
      );

      const data = this.downloadVocabularyResponseResolver.resolve(
        response.data,
        true
      );

      const {
        vocabularyList: downloadedVocabularyList,
        vocabularySetIdPairs,
      } = data;
      noMore = data.noMore;

      const vocabularyList = _.sortBy(downloadedVocabularyList, 'lastSyncedAt');

      const vocabularySetIdMap: { [P in string]: string } = _.fromPairs(
        vocabularySetIdPairs
      );

      const existingVocabularyIds: PromiseType<
        ReturnType<VocabularyModel['vocabularyIdsExist']>
      > = yield call(
        [this.vocabularyModel, 'vocabularyIdsExist'],
        this.userDb,
        vocabularyList.map((vocabulary): string => vocabulary.vocabularyId)
      );

      const chunks = _.chunk(vocabularyList, transactionChunkSize);

      for (const chunk of chunks) {
        const incompatibleVocabularyIds: readonly string[] = response.data.vocabularyList
          .filter(
            (vocabulary: any): vocabulary is { vocabularyId: string } => {
              return (
                _.has(vocabulary, 'vocabularyId') &&
                _.isString(vocabulary.vocabularyId)
              );
            }
          )
          .filter(
            (vocabulary: { vocabularyId: string }): boolean => {
              return _.includes(
                chunk.map((vocabulary): string => vocabulary.vocabularyId),
                vocabulary.vocabularyId
              );
            }
          )
          .filter(
            (vocabulary: { vocabularyId: string }): boolean => {
              return !this.vocabularyResolver.isValid(vocabulary, false);
            }
          )
          .map(
            (vocabulary: { vocabularyId: string }): string => {
              return vocabulary.vocabularyId;
            }
          );

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.vocabularyModel.insertMultipleVocabulary(
              tx,
              chunk
                .filter(
                  (vocabulary): boolean =>
                    !_.includes(existingVocabularyIds, vocabulary.vocabularyId)
                )
                .map(
                  (vocabulary): [Vocabulary, string] => [
                    vocabulary,
                    vocabularySetIdMap[vocabulary.vocabularyId],
                  ]
                ),
              'remote'
            );

            this.vocabularyModel.updateMultipleVocabulary(
              tx,
              chunk
                .filter(
                  (vocabulary): boolean =>
                    _.includes(existingVocabularyIds, vocabulary.vocabularyId)
                )
                .map(
                  (vocabulary): [DeepPartial<Vocabulary>, string] => [
                    vocabulary,
                    vocabularySetIdMap[vocabulary.vocabularyId],
                  ]
                ),
              'remote'
            );

            this.incompatibleVocabularyModel.upsertMultipleIncompatibleVocabulary(
              tx,
              incompatibleVocabularyIds,
              currentComparableCommonVersion
            );
          }
        );

        yield delay(delayBetweenChunks);
      }

      yield put(
        createAction(ActionType.VOCABULARY__DOWNLOAD_VOCABULARY_SUCCEEDED, {
          vocabularyList,
          noMore,
        })
      );
      success = true;
    } catch (error) {
      yield put(
        createAction(ActionType.VOCABULARY__DOWNLOAD_VOCABULARY_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
      success = false;
    }

    return { success, noMore };
  }
}
