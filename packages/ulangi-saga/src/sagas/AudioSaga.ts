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

import { AudioPlayerAdapter } from '../adapters/AudioPlayerAdapter';
import { errorConverter } from '../converters/ErrorConverter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { ProtectedSaga } from './ProtectedSaga';

export class AudioSaga extends ProtectedSaga {
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private fileSystem: typeof FileSystem;
  private audioPlayer: AudioPlayerAdapter;

  private synthesizedMap: Map<string, string>;

  public constructor(
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    fileSystem: typeof FileSystem,
    audioPlayer: AudioPlayerAdapter
  ) {
    super();
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.fileSystem = fileSystem;
    this.audioPlayer = audioPlayer;

    this.synthesizedMap = new Map();
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
    yield fork([this, this.allowPlay]);
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

        let audioKey = languageCode + '-' + text;
        let audioFilePath = yield call(
          [this, this.getSynthesizedAudioFile],
          audioKey
        );

        if (typeof audioFilePath === 'undefined') {
          audioFilePath =
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
            toFile: audioFilePath,
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Cache-Control': 'no-store',
            },
          });

          const response: FileSystem.DownloadResult = yield promise;

          if (response.statusCode === 200) {
            this.synthesizedMap.set(audioKey, audioFilePath);
          } else {
            throw new Error(ErrorCode.GENERAL__UNKNOWN_ERROR);
          }
        }

        yield put(
          createAction(ActionType.AUDIO__SYNTHESIZE_SPEECH_SUCCEEDED, {
            text,
            filePath: audioFilePath,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.AUDIO__SYNTHESIZE_SPEECH_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
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
              errorCode: errorConverter.getErrorCode(error),
              error,
            }
          )
        );
      }
    }
  }

  public *allowPlay(): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.AUDIO__PLAY> = yield take(
        ActionType.AUDIO__PLAY
      );

      try {
        yield put(createAction(ActionType.AUDIO__PLAYING, null));

        yield call([this.audioPlayer, 'stopCurrentSound']);

        // on Android, we need to release the current resource
        // Otherwise, sometimes the player does not play
        yield call([this.audioPlayer, 'releaseCurrentSound']);

        yield call([this.audioPlayer, 'play'], action.payload.filePath);

        yield put(createAction(ActionType.AUDIO__PLAY_SUCCEEDED, null));
      } catch (error) {
        yield put(
          createAction(ActionType.AUDIO__PLAY_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  private *getSynthesizedAudioFile(key: string): IterableIterator<any> {
    let audioFilePath = this.synthesizedMap.get(key);

    if (typeof audioFilePath !== 'undefined') {
      const exists = yield call([this.fileSystem, 'exists'], audioFilePath);
      return exists ? audioFilePath : undefined;
    } else {
      return undefined;
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
