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

export class ObservableChangePasswordScreen extends ObservableScreen {
  @observable
  public currentPassword: string;

  @observable
  public newPassword: string;

  @observable
  public confirmNewPassword: string;

  public constructor(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmNewPassword = confirmNewPassword;
  }
}
