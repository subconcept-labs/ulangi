/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme, ThemeTrigger } from '@ulangi/ulangi-common/enums';
import { ThemeSettings } from '@ulangi/ulangi-common/interfaces';
import { action, computed, observable } from 'mobx';

import { ObservableStore } from './ObservableStore';
import { ObservableUserStore } from './ObservableUserStore';

export class ObservableThemeStore extends ObservableStore {
  private userStore: ObservableUserStore;

  private defaultThemeSettings: ThemeSettings;

  @observable
  public systemMode: undefined | Theme;

  @computed
  public get theme(): Theme {
    const trigger =
      this.userStore.currentUser === null ||
      typeof this.userStore.currentUser.themeSettings === 'undefined'
        ? this.defaultThemeSettings.trigger
        : this.userStore.currentUser.themeSettings.trigger;

    if (trigger === ThemeTrigger.SYSTEM) {
      return typeof this.systemMode !== 'undefined'
        ? this.systemMode
        : Theme.LIGHT;
    } else if (trigger === ThemeTrigger.ALWAYS_DARK) {
      return Theme.DARK;
    } else {
      return Theme.LIGHT;
    }
  }

  @action
  public reset(newThemeStore: ObservableThemeStore): void {
    this.userStore = newThemeStore.userStore;
    this.defaultThemeSettings = newThemeStore.defaultThemeSettings;
    this.systemMode = newThemeStore.systemMode;
  }

  public constructor(
    userStore: ObservableUserStore,
    defaultThemeSettings: ThemeSettings,
    systemMode: undefined | Theme
  ) {
    super();
    this.userStore = userStore;
    this.defaultThemeSettings = defaultThemeSettings;
    this.systemMode = systemMode;
  }
}
