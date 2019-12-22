/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { put, take } from 'redux-saga/effects';

import { SystemDarkModeAdapter } from '../adapters/SystemDarkModeAdapter';
import { PublicSaga } from '../sagas/PublicSaga';

export class DarkModeSaga extends PublicSaga {
  private systemDarkMode: SystemDarkModeAdapter;

  public constructor(systemDarkMode: SystemDarkModeAdapter) {
    super();
    this.systemDarkMode = systemDarkMode;
  }

  public *run(): IterableIterator<any> {
    const channel = this.systemDarkMode.createEventChannel();

    while (true) {
      const systemMode = yield take(channel);

      yield put(
        createAction(ActionType.DARK_MODE__SYSTEM_MODE_CHANGED, { systemMode })
      );
    }
  }
}
