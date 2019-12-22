/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DarkModeSettings } from '@ulangi/ulangi-common/interfaces';
import { ObservableUserStore } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class DarkModeSettingsDelegate {
  private userStore: ObservableUserStore;

  public constructor(userStore: ObservableUserStore) {
    this.userStore = userStore;
  }

  public getCurrentSettings(): DarkModeSettings {
    if (
      this.userStore.currentUser === null ||
      typeof this.userStore.currentUser.darkModeSettings === 'undefined'
    ) {
      return config.user.defaultDarkModeSettings;
    } else {
      return this.userStore.currentUser.darkModeSettings;
    }
  }
}
