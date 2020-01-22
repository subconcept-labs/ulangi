/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { SyncTask } from '@ulangi/ulangi-common/enums';
import { DatabaseEvent, DatabaseEventBus } from '@ulangi/ulangi-local-database';
import { EventChannel } from 'redux-saga';
import { cancelled, fork, put, take } from 'redux-saga/effects';

import { DatabaseEventChannel } from '../channels/DatabaseEventChannel';
import { errorConverter } from '../converters/ErrorConverter';
import { ProtectedSaga } from './ProtectedSaga';

export class ObserveLocalUpdateSaga extends ProtectedSaga {
  private databaseEventBus: DatabaseEventBus;

  public constructor(databaseEventBus: DatabaseEventBus) {
    super();
    this.databaseEventBus = databaseEventBus;
  }

  public *run(): IterableIterator<any> {
    yield fork([this, this.allowObserveLocalUpdatesForSyncing]);
  }

  public *allowObserveLocalUpdatesForSyncing(): IterableIterator<any> {
    let channel!: EventChannel<DatabaseEvent>;
    try {
      const action: Action<
        ActionType.SYNC__OBSERVE_LOCAL_UPDATES_FOR_SYNCING
      > = yield take(ActionType.SYNC__OBSERVE_LOCAL_UPDATES_FOR_SYNCING);
      const { addUploadTasks } = action.payload;

      channel = new DatabaseEventChannel(this.databaseEventBus).createChannel();

      if (addUploadTasks === true) {
        yield put(
          createAction(ActionType.SYNC__ADD_SYNC_TASK, {
            syncTask: SyncTask.UPLOAD_USER,
          })
        );
        yield put(
          createAction(ActionType.SYNC__ADD_SYNC_TASK, {
            syncTask: SyncTask.UPLOAD_SETS,
          })
        );
        yield put(
          createAction(ActionType.SYNC__ADD_SYNC_TASK, {
            syncTask: SyncTask.UPLOAD_VOCABULARY,
          })
        );
      }
      yield put(
        createAction(ActionType.SYNC__OBSERVING_LOCAL_UPDATES_FOR_SYNCING, null)
      );

      while (true) {
        const eventName = yield take(channel);
        if (
          eventName === DatabaseEvent.VOCABULARY_INSERTED_FROM_LOCAL ||
          eventName === DatabaseEvent.VOCABULARY_UPDATED_FROM_LOCAL
        ) {
          yield put(
            createAction(ActionType.SYNC__ADD_SYNC_TASK, {
              syncTask: SyncTask.UPLOAD_VOCABULARY,
            })
          );
        } else if (
          eventName === DatabaseEvent.SET_INSERTED_FROM_LOCAL ||
          eventName === DatabaseEvent.SET_UPDATED_FROM_LOCAL
        ) {
          yield put(
            createAction(ActionType.SYNC__ADD_SYNC_TASK, {
              syncTask: SyncTask.UPLOAD_SETS,
            })
          );
        } else if (eventName === DatabaseEvent.USER_UPDATED_FROM_LOCAL) {
          yield put(
            createAction(ActionType.SYNC__ADD_SYNC_TASK, {
              syncTask: SyncTask.UPLOAD_USER,
            })
          );
        }
      }
    } catch (error) {
      yield put(
        createAction(
          ActionType.SYNC__OBSERVE_LOCAL_UPDATES_FOR_SYNCING_FAILED,
          {
            errorCode: errorConverter.getErrorCode(error),
            error,
          }
        )
      );
    } finally {
      if (yield cancelled() && typeof channel !== 'undefined') {
        channel.close();
        console.log('Local update event channel closed.');
      }
    }
  }
}
