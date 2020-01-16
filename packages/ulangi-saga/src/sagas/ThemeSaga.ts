/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { put, take } from 'redux-saga/effects';

import { SystemThemeAdapter } from '../adapters/SystemThemeAdapter';
import { PublicSaga } from '../sagas/PublicSaga';

export class ThemeSaga extends PublicSaga {
  private systemTheme: SystemThemeAdapter;

  public constructor(systemTheme: SystemThemeAdapter) {
    super();
    this.systemTheme = systemTheme;
  }

  public *run(): IterableIterator<any> {
    const channel = this.systemTheme.createEventChannel();

    while (true) {
      const systemMode = yield take(channel);

      yield put(
        createAction(ActionType.THEME__SYSTEM_MODE_CHANGED, { systemMode })
      );
    }
  }
}
