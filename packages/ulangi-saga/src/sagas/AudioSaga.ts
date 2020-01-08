/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorCode } from '@ulangi/ulangi-common/enums';
import { SessionModel } from '@ulangi/ulangi-local-database';
import * as querystring from 'query-string';
import * as FileSystem from 'react-native-fs';
import { call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';
import * as uuid from 'uuid';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { ProtectedSaga } from './ProtectedSaga';

export class AudioSaga extends ProtectedSaga {
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private fileSystem: typeof FileSystem;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    fileSystem: typeof FileSystem,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.fileSystem = fileSystem;
    this.crashlytics = crashlytics;
  }

  public *run(env: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowSynthesizeSpeech],
      env.API_URL,
      config.audio.cacheFolderName
    );
    yield fork(
      [this, this.allowClearSynthesizedSpeechCache],
      config.audio.cacheFolderName
    );
  }

  public *allowSynthesizeSpeech(
    apiUrl: string,
    cacheFolderName: string
  ): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.AUDIO__SYNTHESIZE_SPEECH> = yield take(
        ActionType.AUDIO__SYNTHESIZE_SPEECH
      );
      const { text, languageCode } = action.payload;

      try {
        yield put(createAction(ActionType.AUDIO__SYNTHESIZING_SPEECH, null));

        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        yield call([this, this.createCacheFolderIfNotExists], cacheFolderName);

        const filePathToSave =
          this.fileSystem.CachesDirectoryPath +
          '/' +
          cacheFolderName +
          '/' +
          uuid.v4() +
          '.mp3';

        const { promise } = this.fileSystem.downloadFile({
          fromUrl:
            apiUrl +
            '/synthesize-speech?' +
            querystring.stringify({
              text,
              languageCode,
            }),
          toFile: filePathToSave,
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-store',
          },
        });

        const response: FileSystem.DownloadResult = yield promise;

        if (response.statusCode === 200) {
          yield put(
            createAction(ActionType.AUDIO__SYNTHESIZE_SPEECH_SUCCEEDED, {
              text,
              filePath: filePathToSave,
            })
          );
        } else {
          throw new Error(ErrorCode.GENERAL__UNKNOWN_ERROR);
        }
      } catch (error) {
        yield put(
          createAction(ActionType.AUDIO__SYNTHESIZE_SPEECH_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowClearSynthesizedSpeechCache(
    cacheFolderName: string
  ): IterableIterator<any> {
    while (true) {
      yield take(ActionType.AUDIO__CLEAR_SYNTHESIZED_SPEECH_CACHE);

      try {
        yield put(
          createAction(
            ActionType.AUDIO__CLEARING_SYNTHESIZED_SPEECH_CACHE,
            null
          )
        );

        yield call([this, this.deleteCacheFolderIfExists], cacheFolderName);

        yield put(
          createAction(
            ActionType.AUDIO__CLEAR_SYNTHESIZED_SPEECH_CACHE_SUCCEEDED,
            null
          )
        );
      } catch (error) {
        yield put(
          createAction(
            ActionType.AUDIO__CLEAR_SYNTHESIZED_SPEECH_CACHE_FAILED,
            {
              errorCode: this.crashlytics.getErrorCode(error),
            }
          )
        );
      }
    }
  }

  private *createCacheFolderIfNotExists(
    folderName: string
  ): IterableIterator<any> {
    const cacheFolder = this.fileSystem.CachesDirectoryPath + '/' + folderName;

    const exists = yield call([this.fileSystem, 'exists'], cacheFolder);

    if (!exists) {
      yield call(
        [this.fileSystem, 'mkdir'],
        this.fileSystem.CachesDirectoryPath + '/' + folderName
      );
    }
  }

  private *deleteCacheFolderIfExists(
    folderName: string
  ): IterableIterator<any> {
    const cacheFolder = this.fileSystem.CachesDirectoryPath + '/' + folderName;

    const exists = yield call([this.fileSystem, 'exists'], cacheFolder);

    if (exists) {
      yield call(
        [this.fileSystem, 'unlink'],
        this.fileSystem.CachesDirectoryPath + '/' + folderName
      );
    }
  }
}
