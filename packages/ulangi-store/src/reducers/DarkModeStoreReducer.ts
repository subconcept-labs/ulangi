/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, InferableAction } from '@ulangi/ulangi-action';
import { ObservableDarkModeStore } from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class DarkModeStoreReducer extends Reducer {
  private darkModeStore: ObservableDarkModeStore;

  public constructor(darkModeStore: ObservableDarkModeStore) {
    super();
    this.darkModeStore = darkModeStore;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.DARK_MODE__SYSTEM_MODE_CHANGED)) {
      this.systemModeChanged(action);
    }
  }

  private systemModeChanged(
    action: Action<ActionType.DARK_MODE__SYSTEM_MODE_CHANGED>
  ): void {
    this.darkModeStore.systemMode = action.payload.systemMode;
  }
}
