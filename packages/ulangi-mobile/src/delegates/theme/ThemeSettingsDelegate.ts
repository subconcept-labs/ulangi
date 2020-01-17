/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ThemeSettings } from '@ulangi/ulangi-common/interfaces';
import { ObservableUserStore } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class ThemeSettingsDelegate {
  private userStore: ObservableUserStore;

  public constructor(userStore: ObservableUserStore) {
    this.userStore = userStore;
  }

  public getCurrentSettings(): ThemeSettings {
    if (
      this.userStore.currentUser === null ||
      typeof this.userStore.currentUser.themeSettings === 'undefined'
    ) {
      return config.user.defaultThemeSettings;
    } else {
      return this.userStore.currentUser.themeSettings;
    }
  }
}
