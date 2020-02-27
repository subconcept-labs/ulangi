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
import { DownloadSpecificVocabularyRequest } from '@ulangi/ulangi-common/interfaces';
import {
  DownloadSpecificVocabularyResponseResolver,
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

export class DownloadIncompatibleVocabularySaga {
  private vocabularyResolver = new VocabularyResolver();
  private downloadSpecificVocabularyResponseResolver = new DownloadSpecificVocabularyResponseResolver();

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

  public *downloadIncompatibleVocabulary(
    apiUrl: string,
    downloadLimit: number,
    delayBetweenTransactions: number
  ): IterableIterator<any> {
    let success, noMore;
    try {
      yield put(
        createAction(
          ActionType.VOCABULARY__DOWNLOADING_INCOMPATIBLE_VOCABULARY,
          null
        )
      );

      const accessToken: PromiseType<
        ReturnType<SessionModel['getAccessToken']>
      > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

      const latestSyncedTime: PromiseType<
        ReturnType<VocabularyModel['getLatestSyncTime']>
      > = yield call([this.vocabularyModel, 'getLatestSyncTime'], this.userDb);

      const {
        vocabularyIds: existingIncompatibleVocabularyIds,
      }: PromiseType<
        ReturnType<
          IncompatibleVocabularyModel['getIncompatibleVocabularyIdsForRedownload']
        >
      > = yield call(
        [
          this.incompatibleVocabularyModel,
          'getIncompatibleVocabularyIdsForRedownload',
        ],
        this.userDb,
        currentComparableCommonVersion,
        downloadLimit,
        true
      );

      noMore = existingIncompatibleVocabularyIds.length === 0;

      const response: AxiosResponse<any> = yield call(
        [axios, 'request'],
        createRequest<DownloadSpecificVocabularyRequest>(
          'post',
          apiUrl,
          '/download-specific-vocabulary',
          null,
          {
            vocabularyIds: existingIncompatibleVocabularyIds,
          },
          { accessToken: assertExists(accessToken) }
        )
      );

      const {
        vocabularyList: downloadedVocabularyList,
        vocabularySetIdPairs,
      } = this.downloadSpecificVocabularyResponseResolver.resolve(
        response.data,
        true
      );

      const vocabularyList = downloadedVocabularyList.filter(
        (vocabulary): boolean => {
          return (
            vocabulary.lastSyncedAt !== null &&
            latestSyncedTime !== null &&
            vocabulary.lastSyncedAt <= latestSyncedTime
          );
        }
      );

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
              : this.incompatibleVocabularyModel.deleteIncompatibleVocabulary(
                  tx,
                  vocabulary.vocabularyId
                );
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
                  definitions: definitionChunk,
                },
                undefined,
                'remote'
              );
            }
          );

          yield delay(delayBetweenTransactions);
        }
      }

      yield put(
        createAction(
          ActionType.VOCABULARY__DOWNLOAD_INCOMPATIBLE_VOCABULARY_SUCCEEDED,
          {
            vocabularyList,
          }
        )
      );
      success = true;
    } catch (error) {
      yield put(
        createAction(
          ActionType.VOCABULARY__DOWNLOAD_INCOMPATIBLE_VOCABULARY_FAILED,
          {
            errorCode: errorConverter.getErrorCode(error),
            error,
          }
        )
      );
      success = false;
    }

    return { success, noMore };
  }
}
