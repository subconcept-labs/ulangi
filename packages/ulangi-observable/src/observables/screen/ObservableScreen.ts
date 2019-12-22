/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName, ScreenState } from '@ulangi/ulangi-common/enums';
import { ScreenTitle } from '@ulangi/ulangi-common/interfaces';
import { observable } from 'mobx';

export class ObservableScreen {
  @observable
  public screenName: ScreenName;

  @observable
  public screenTitle?: ScreenTitle;

  @observable
  public screenState: ScreenState;

  public constructor(screenName: ScreenName, screenTitle?: ScreenTitle) {
    this.screenName = screenName;
    this.screenTitle = screenTitle;
    this.screenState = ScreenState.UNMOUNTED;
  }
}
