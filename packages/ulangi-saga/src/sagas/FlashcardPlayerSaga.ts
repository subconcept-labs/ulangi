/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import { ErrorCode, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { VocabularyModel } from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import * as Joi from 'joi';
import { call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { createRequest } from '../utils/createRequest';
import { ProtectedSaga } from './ProtectedSaga';

export class FlashcardPlayerSaga extends ProtectedSaga {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  private userDb: SQLiteDatabase;
  private vocabularyModel: VocabularyModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    vocabularyModel: VocabularyModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.userDb = userDb;
    this.vocabularyModel = vocabularyModel;
    this.crashlytics = crashlytics;
  }

  public *run(config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowUpload],
      config.env.flashcardPlayerUrl,
      config.flashcardPlayer.minToPlay,
      config.flashcardPlayer.uploadLimit
    );
  }

  public *allowUpload(
    flashcardPlayerUrl: string,
    minToPlay: number,
    uploadLimit: number
  ): IterableIterator<any> {
    try {
      const action: Action<ActionType.FLASHCARD_PLAYER__UPLOAD> = yield take(
        ActionType.FLASHCARD_PLAYER__UPLOAD
      );

      const { setId, languagePair, selectedCategoryNames } = action.payload;

      yield put(createAction(ActionType.FLASHCARD_PLAYER__UPLOADING, null));

      const {
        vocabularyList,
      }: PromiseType<
        ReturnType<VocabularyModel['getVocabularyList']>
      > = yield call(
        [this.vocabularyModel, 'getVocabularyList'],
        this.userDb,
        setId,
        VocabularyStatus.ACTIVE,
        selectedCategoryNames,
        uploadLimit,
        0,
        true
      );

      if (vocabularyList.length > minToPlay) {
        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest(
            'post',
            flashcardPlayerUrl,
            '/upload',
            null,
            this.convertVocabularyListToFlashcardSet(
              vocabularyList,
              languagePair
            ),
            null
          )
        );

        const { id } = this.resolveUploadResponseData(response.data);

        yield put(
          createAction(ActionType.FLASHCARD_PLAYER__UPLOAD_SUCCEEDED, {
            playlistId: id,
          })
        );
      } else {
        throw new Error(ErrorCode.FLASHCARD_PLAYER__INSUFFICIENT_VOCABULARY);
      }
    } catch (error) {
      yield put(
        createAction(ActionType.FLASHCARD_PLAYER__UPLOAD_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }

  private convertVocabularyListToFlashcardSet(
    vocabularyList: readonly Vocabulary[],
    languagePair: string
  ): {
    languagePair: string;
    flashcards: [string, string][];
  } {
    return {
      languagePair,
      flashcards: vocabularyList.map(
        (vocabulary): [string, string] => {
          return [
            this.vocabularyExtraFieldParser.parse(vocabulary.vocabularyText)
              .vocabularyTerm,
            vocabulary.definitions
              .map(
                (definition): string => {
                  return definition.meaning;
                }
              )
              .join('\n'),
          ];
        }
      ),
    };
  }

  private resolveUploadResponseData(data: any): { id: string } {
    return Joi.attempt(data, {
      id: Joi.string(),
    });
  }
}
