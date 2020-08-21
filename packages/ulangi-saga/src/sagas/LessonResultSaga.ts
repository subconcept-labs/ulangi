/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UploadLessonResultsRequest } from '@ulangi/ulangi-common/interfaces';
import { UploadLessonResultsResponseResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseEvent,
  DatabaseEventBus,
  LessonResultModel,
  SessionModel,
} from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import { EventChannel } from 'redux-saga';
import { call, cancelled, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { DatabaseEventChannel } from '../channels/DatabaseEventChannel';
import { errorConverter } from '../converters/ErrorConverter';
import { SagaEnv } from '../interfaces/SagaEnv';
import { createRequest } from '../utils/createRequest';
import { ProtectedSaga } from './ProtectedSaga';

export class LessonResultSaga extends ProtectedSaga {
  private uploadLessonResultsResponseResolver = new UploadLessonResultsResponseResolver();

  private userDb: SQLiteDatabase;
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private lessonResultModel: LessonResultModel;
  private databaseEventBus: DatabaseEventBus;

  public constructor(
    userDb: SQLiteDatabase,
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    lessonResultModel: LessonResultModel,
    databaseEventBus: DatabaseEventBus
  ) {
    super();
    this.userDb = userDb;
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.lessonResultModel = lessonResultModel;
    this.databaseEventBus = databaseEventBus;
  }

  public *run(env: SagaEnv): IterableIterator<any> {
    yield fork([this, this.autoUploadLessonResults]);
    yield fork([this, this.allowUploadLessonResults], env.API_URL);
  }

  public *autoUploadLessonResults(): IterableIterator<any> {
    let channel!: EventChannel<DatabaseEvent>;

    try {
      channel = new DatabaseEventChannel(this.databaseEventBus).createChannel();

      while (true) {
        const eventName = yield take(channel);
        if (eventName === DatabaseEvent.LESSON_RESULT_INSERTED) {
          yield put(createAction(ActionType.LESSON_RESULTS__UPLOAD, null));
        }
      }
    } finally {
      if (yield cancelled() && typeof channel !== 'undefined') {
        channel.close();
        console.log('Local update event channel closed.');
      }
    }
  }

  private *allowUploadLessonResults(apiUrl: string): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.LESSON_RESULTS__UPLOAD);

        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        let done = false;

        while (done === false) {
          const lessonResults: PromiseType<
            ReturnType<LessonResultModel['getLessonResults']>
          > = yield call(
            [this.lessonResultModel, 'getLessonResults'],
            this.userDb,
            30,
            true
          );

          if (lessonResults.length > 0) {
            yield put(
              createAction(ActionType.LESSON_RESULTS__UPLOADING, {
                lessonResults,
              })
            );

            const response: AxiosResponse<any> = yield call(
              [axios, 'request'],
              createRequest<UploadLessonResultsRequest>(
                'post',
                apiUrl,
                '/upload-lesson-results',
                null,
                {
                  lessonResults,
                },
                { accessToken: assertExists(accessToken) }
              )
            );

            const {
              acknowledged,
            } = this.uploadLessonResultsResponseResolver.resolve(
              response.data,
              true
            );

            yield call(
              [this.userDb, 'transaction'],
              (tx: Transaction): void => {
                this.lessonResultModel.deleteLessonResults(tx, acknowledged);
              }
            );
          } else {
            done = true;
          }
        }

        yield put(
          createAction(ActionType.LESSON_RESULTS__UPLOAD_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.LESSON_RESULTS__UPLOAD_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }
}
