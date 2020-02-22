/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { currentComparableCommonVersion } from '@ulangi/ulangi-common';
import { DownloadVocabularyRequest } from '@ulangi/ulangi-common/interfaces';
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

import { errorConverter } from '../converters/ErrorConverter';
import { createRequest } from '../utils/createRequest';

export class DownloadVocabularySaga {
  private vocabularyResolver = new VocabularyResolver();
  private downloadVocabularyResponseResolver = new DownloadVocabularyResponseResolver();

  private userDb: SQLiteDatabase;
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private vocabularyModel: VocabularyModel;
  private incompatibleVocabularyModel: IncompatibleVocabularyModel;

  public constructor(
    userDb: SQLiteDatabase,
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    vocabularyModel: VocabularyModel,
    incompatibleVocabularyModel: IncompatibleVocabularyModel
  ) {
    this.userDb = userDb;
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.vocabularyModel = vocabularyModel;
    this.incompatibleVocabularyModel = incompatibleVocabularyModel;
  }

  public *downloadVocabulary(
    apiUrl: string,
    downloadLimit: number,
    delayBetweenTransactions: number
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

      for (const vocabulary of vocabularyList) {
        // If there are too many definitions, the app will become slow
        // Split definitions into chunks
        const definitionChunks = _.chunk(vocabulary.definitions, 10);

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            !_.includes(existingVocabularyIds, vocabulary.vocabularyId)
              ? this.vocabularyModel.insertVocabulary(
                  tx,
                  {
                    ...vocabulary,
                    definitions: definitionChunks.shift() || [],
                  },
                  vocabularySetIdMap[vocabulary.vocabularyId],
                  'remote'
                )
              : this.vocabularyModel.updateVocabulary(
                  tx,
                  {
                    ...vocabulary,
                    definitions: definitionChunks.shift() || [],
                  },
                  vocabularySetIdMap[vocabulary.vocabularyId],
                  'remote'
                );
            !this.vocabularyResolver.isValid(vocabulary, false)
              ? this.incompatibleVocabularyModel.upsertIncompatibleVocabulary(
                  tx,
                  vocabulary.vocabularyId,
                  currentComparableCommonVersion
                )
              : _.noop();
          }
        );

        yield delay(delayBetweenTransactions);

        for (const definitionChunk of definitionChunks) {
          yield call(
            [this.userDb, 'transaction'],
            (tx: Transaction): void => {
              this.vocabularyModel.updateVocabulary(
                tx,
                {
                  vocabularyId: vocabulary.vocabularyId,
                  definitions: definitionChunk || [],
                },
                vocabularySetIdMap[vocabulary.vocabularyId],
                'remote'
              );
            }
          );

          yield delay(delayBetweenTransactions);
        }
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
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
      success = false;
    }

    return { success, noMore };
  }
}
