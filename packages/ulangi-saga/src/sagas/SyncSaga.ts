/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { SyncTask } from '@ulangi/ulangi-common/enums';
import { RemoteConfig } from '@ulangi/ulangi-common/interfaces';
import { Task } from 'redux-saga';
import { call, delay, fork, put, race, take } from 'redux-saga/effects';

import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { SyncQueue } from '../queues/SyncQueue';
import { DownloadIncompatibleSetSaga } from './DownloadIncompatibleSetSaga';
import { DownloadIncompatibleVocabularySaga } from './DownloadIncompatibleVocabularySaga';
import { DownloadSetSaga } from './DownloadSetSaga';
import { DownloadUserSaga } from './DownloadUserSaga';
import { DownloadVocabularySaga } from './DownloadVocabularySaga';
import { ProtectedSaga } from './ProtectedSaga';
import { UploadSetSaga } from './UploadSetSaga';
import { UploadUserSaga } from './UploadUserSaga';
import { UploadVocabularySaga } from './UploadVocabularySaga';

export class SyncSaga extends ProtectedSaga {
  private syncQueue: SyncQueue;
  private syncWorker?: Task;

  private uploadUserSaga: UploadUserSaga;
  private uploadSetSaga: UploadSetSaga;
  private uploadVocabularySaga: UploadVocabularySaga;
  private downloadUserSaga: DownloadUserSaga;
  private downloadSetSaga: DownloadSetSaga;
  private downloadVocabularySaga: DownloadVocabularySaga;
  private downloadIncompatibleSetSaga: DownloadIncompatibleSetSaga;
  private downloadIncompatibleVocabularySaga: DownloadIncompatibleVocabularySaga;

  public constructor(
    uploadUserSaga: UploadUserSaga,
    uploadSetSaga: UploadSetSaga,
    uploadVocabularySaga: UploadVocabularySaga,
    downloadUserSaga: DownloadUserSaga,
    downloadSetSaga: DownloadSetSaga,
    downloadVocabularySaga: DownloadVocabularySaga,
    downloadIncompatibleSetSaga: DownloadIncompatibleSetSaga,
    downloadIncompatibleVocabularySaga: DownloadIncompatibleVocabularySaga
  ) {
    super();
    this.uploadUserSaga = uploadUserSaga;
    this.uploadSetSaga = uploadSetSaga;
    this.uploadVocabularySaga = uploadVocabularySaga;
    this.downloadUserSaga = downloadUserSaga;
    this.downloadSetSaga = downloadSetSaga;
    this.downloadVocabularySaga = downloadVocabularySaga;
    this.downloadIncompatibleSetSaga = downloadIncompatibleSetSaga;
    this.downloadIncompatibleVocabularySaga = downloadIncompatibleVocabularySaga;
    this.syncQueue = new SyncQueue([
      [SyncTask.UPLOAD_USER, 0],
      [SyncTask.DOWNLOAD_USER, 1],
      [SyncTask.UPLOAD_SETS, 2],
      [SyncTask.DOWNLOAD_SETS, 3],
      [SyncTask.DOWNLOAD_INCOMPATIBLE_SETS, 4],
      [SyncTask.UPLOAD_VOCABULARY, 5],
      [SyncTask.DOWNLOAD_VOCABULARY, 6],
      [SyncTask.DOWNLOAD_INCOMPATIBLE_VOCABULARY, 7],
    ]);
  }

  public *run(
    env: SagaEnv,
    config: SagaConfig,
    remoteConfig: RemoteConfig
  ): IterableIterator<any> {
    yield fork(
      [this, this.allowAddSyncTask],
      env.API_URL,
      config.sync.delayBetweenTransactions,
      remoteConfig.sync.uploadLimit,
      remoteConfig.sync.downloadLimit,
      remoteConfig.sync.minDelay,
      remoteConfig.sync.maxDelay,
      remoteConfig.sync.incrementDelayOnError
    );
  }

  public *allowAddSyncTask(
    apiUrl: string,
    delayBetweenTransactions: number,
    uploadLimit: number,
    downloadLimit: number,
    minDelay: number,
    maxDelay: number,
    incrementDelayOnError: number
  ): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.SYNC__ADD_SYNC_TASK> = yield take(
        ActionType.SYNC__ADD_SYNC_TASK
      );
      const { syncTask } = action.payload;

      this.syncQueue.add(syncTask);

      // Starting syncing only if it isn't
      if (
        typeof this.syncWorker === 'undefined' ||
        !this.syncWorker.isRunning() ||
        this.syncWorker.isCancelled()
      ) {
        this.syncWorker = yield fork(
          [this, this.sync],
          apiUrl,
          delayBetweenTransactions,
          uploadLimit,
          downloadLimit,
          minDelay,
          maxDelay,
          incrementDelayOnError
        );
      }
    }
  }

  private *sync(
    apiUrl: string,
    delayBetweenTransactions: number,
    uploadLimit: number,
    downloadLimit: number,
    minDelay: number,
    maxDelay: number,
    incrementDelayOnError: number
  ): IterableIterator<any> {
    let delayTime = minDelay;
    yield put(createAction(ActionType.SYNC__SYNCING, null));

    while (!this.syncQueue.isEmpty()) {
      const syncTask = this.syncQueue.shift();

      let result;
      if (syncTask === SyncTask.UPLOAD_USER) {
        result = yield call([this.uploadUserSaga, 'uploadUser'], apiUrl);
      } else if (syncTask === SyncTask.DOWNLOAD_USER) {
        result = yield call([this.downloadUserSaga, 'downloadUser'], apiUrl);
      } else if (syncTask === SyncTask.UPLOAD_SETS) {
        result = yield call(
          [this.uploadSetSaga, 'uploadSets'],
          apiUrl,
          uploadLimit
        );
      } else if (syncTask === SyncTask.DOWNLOAD_SETS) {
        result = yield call(
          [this.downloadSetSaga, 'downloadSets'],
          apiUrl,
          downloadLimit,
          delayBetweenTransactions
        );
      } else if (syncTask === SyncTask.DOWNLOAD_INCOMPATIBLE_SETS) {
        result = yield call(
          [this.downloadIncompatibleSetSaga, 'downloadIncompatibleSets'],
          apiUrl,
          downloadLimit,
          delayBetweenTransactions
        );
      } else if (syncTask === SyncTask.UPLOAD_VOCABULARY) {
        result = yield call(
          [this.uploadVocabularySaga, 'uploadVocabulary'],
          apiUrl,
          uploadLimit
        );
      } else if (syncTask === SyncTask.DOWNLOAD_VOCABULARY) {
        result = yield call(
          [this.downloadVocabularySaga, 'downloadVocabulary'],
          apiUrl,
          downloadLimit,
          delayBetweenTransactions
        );
      } else if (syncTask === SyncTask.DOWNLOAD_INCOMPATIBLE_VOCABULARY) {
        result = yield call(
          [
            this.downloadIncompatibleVocabularySaga,
            'downloadIncompatibleVocabulary',
          ],
          apiUrl,
          downloadLimit,
          delayBetweenTransactions
        );
      } else {
        throw new Error('syncTask is invalid');
      }

      const { success, noMore } = result;

      if (success === true) {
        delayTime = minDelay;
      } else {
        delayTime =
          delayTime < maxDelay ? delayTime + incrementDelayOnError : maxDelay;
      }

      if (noMore === false || success === false) {
        this.syncQueue.add(syncTask);
      }

      // Cancel delay when connection changed
      yield race({
        connectionChanged: take(ActionType.NETWORK__CONNECTION_CHANGED),
        delay: delay(delayTime),
      });
    }

    yield put(createAction(ActionType.SYNC__SYNC_COMPLETED, null));
  }
}
