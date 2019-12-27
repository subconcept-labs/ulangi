/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableDarkModeSettings } from './ObservableDarkModeSettings';

export class ObservableDarkModeScreen extends ObservableScreen {
  @observable
  public settings: ObservableDarkModeSettings;

  public constructor(
    settings: ObservableDarkModeSettings,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(screenName, topBar);
    this.settings = settings;
  }
}
