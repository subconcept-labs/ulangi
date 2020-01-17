/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, InferableAction } from '@ulangi/ulangi-action';
import { ObservableThemeStore } from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class ThemeStoreReducer extends Reducer {
  private themeStore: ObservableThemeStore;

  public constructor(themeStore: ObservableThemeStore) {
    super();
    this.themeStore = themeStore;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.THEME__SYSTEM_MODE_CHANGED)) {
      this.systemModeChanged(action);
    }
  }

  private systemModeChanged(
    action: Action<ActionType.THEME__SYSTEM_MODE_CHANGED>
  ): void {
    this.themeStore.systemMode = action.payload.systemMode;
  }
}
