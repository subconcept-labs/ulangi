/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventChannel, eventChannel } from 'redux-saga';
import { call, cancelled, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { PublicSaga } from './PublicSaga';

export class NetworkSaga extends PublicSaga {
  private netInfo: typeof NetInfo;

  public constructor(netInfo: typeof NetInfo) {
    super();
    this.netInfo = netInfo;
  }

  public *run(): IterableIterator<any> {
    yield fork([this, this.allowCheckConnection]);
    yield fork([this, this.allowObserveConnectionChange]);
  }

  public *allowCheckConnection(): IterableIterator<any> {
    while (true) {
      yield take(ActionType.NETWORK__CHECK_CONNECTION);
      try {
        yield put(createAction(ActionType.NETWORK__CHECKING_CONNECTION, null));

        const netInfoState: PromiseType<
          ReturnType<typeof NetInfo['fetch']>
        > = yield call([this.netInfo, 'fetch']);
        yield put(
          createAction(ActionType.NETWORK__CHECK_CONNECTION_SUCCEEDED, {
            isConnected: netInfoState.isConnected,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.NETWORK__CHECK_CONNECTION_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowObserveConnectionChange(): IterableIterator<any> {
    let channel!: EventChannel<boolean>;
    try {
      yield take(ActionType.NETWORK__OBSERVE_CONNECTION_CHANGE);

      channel = this.createConnectionChangeEventChannel();
      yield put(
        createAction(ActionType.NETWORK__OBSERVING_CONNECTION_CHANGE, null)
      );

      while (true) {
        const isConnected = yield take(channel);
        yield put(
          createAction(ActionType.NETWORK__CONNECTION_CHANGED, {
            isConnected,
          })
        );
      }
    } catch (error) {
      yield put(
        createAction(ActionType.NETWORK__OBSERVE_CONNECTION_CHANGE_FAILED, {
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
    } finally {
      if (yield cancelled()) {
        if (typeof channel !== 'undefined') {
          channel.close();
          console.log('Network channel closed');
        }
      }
    }
  }

  private createConnectionChangeEventChannel(): EventChannel<boolean> {
    return eventChannel(
      (emit): (() => void) => {
        const listener = (state: NetInfoState): void => {
          emit(state.isConnected);
        };

        return this.netInfo.addEventListener(listener);
      }
    );
  }
}
