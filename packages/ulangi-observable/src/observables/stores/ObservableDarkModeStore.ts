/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DarkModeTrigger, Theme } from '@ulangi/ulangi-common/enums';
import { DarkModeSettings } from '@ulangi/ulangi-common/interfaces';
import { computed, observable } from 'mobx';

import { ObservableStore } from './ObservableStore';
import { ObservableUserStore } from './ObservableUserStore';

export class ObservableDarkModeStore extends ObservableStore {
  protected noReset = ['userStore', 'defaultDarkModeSettings', 'systemMode'];

  private userStore: ObservableUserStore;

  private defaultDarkModeSettings: DarkModeSettings;

  @observable
  public systemMode: undefined | Theme;

  @computed
  public get theme(): Theme {
    const trigger =
      this.userStore.currentUser === null ||
      typeof this.userStore.currentUser.darkModeSettings === 'undefined'
        ? this.defaultDarkModeSettings.trigger
        : this.userStore.currentUser.darkModeSettings.trigger;

    if (trigger === DarkModeTrigger.SYSTEM) {
      return typeof this.systemMode !== 'undefined'
        ? this.systemMode
        : Theme.LIGHT;
    } else if (trigger === DarkModeTrigger.ALWAYS_DARK) {
      return Theme.DARK;
    } else {
      return Theme.LIGHT;
    }
  }

  public constructor(
    userStore: ObservableUserStore,
    defaultDarkModeSettings: DarkModeSettings,
    systemMode: undefined | Theme
  ) {
    super();
    this.userStore = userStore;
    this.defaultDarkModeSettings = defaultDarkModeSettings;
    this.systemMode = systemMode;
  }
}
