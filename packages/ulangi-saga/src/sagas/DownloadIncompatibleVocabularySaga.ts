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
import {
  DownloadSpecificVocabularyRequest,
  Vocabulary,
} from '@ulangi/ulangi-common/interfaces';
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
    transactionChunkSize: number,
    delayBetweenChunks: number
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

      const chunks = _.chunk(vocabularyList, transactionChunkSize);

      for (const chunk of chunks) {
        const stillIncompatibleVocabularyIds: readonly string[] = response.data.vocabularyList
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
                  (vocabulary): [Vocabulary, string] => [
                    vocabulary,
                    vocabularySetIdMap[vocabulary.vocabularyId],
                  ]
                ),
              'remote'
            );

            this.incompatibleVocabularyModel.deleteMultipleIncompatibleVocabulary(
              tx,
              chunk.map((vocabulary): string => vocabulary.vocabularyId)
            );
            this.incompatibleVocabularyModel.upsertMultipleIncompatibleVocabulary(
              tx,
              stillIncompatibleVocabularyIds,
              currentComparableCommonVersion
            );
          }
        );

        yield delay(delayBetweenChunks);
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
