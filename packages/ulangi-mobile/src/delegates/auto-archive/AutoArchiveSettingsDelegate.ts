/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AutoArchiveSettings } from '@ulangi/ulangi-common/interfaces';
import { ObservableUserStore } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class AutoArchiveSettingsDelegate {
  private userStore: ObservableUserStore;

  public constructor(userStore: ObservableUserStore) {
    this.userStore = userStore;
  }

  public getCurrentSettings(): AutoArchiveSettings {
    const autoArchiveSettings =
      typeof this.userStore.existingCurrentUser.globalAutoArchive !==
      'undefined'
        ? this.userStore.existingCurrentUser.globalAutoArchive
        : config.user.defaultGlobalAutoArchive;

    return autoArchiveSettings;
  }
}
