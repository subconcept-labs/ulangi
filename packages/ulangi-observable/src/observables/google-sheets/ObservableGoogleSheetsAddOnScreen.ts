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

export class ObservableGoogleSheetsAddOnScreen extends ObservableScreen {
  @observable
  public password: string;

  @observable
  public apiKey: undefined | string;

  @observable
  public expiredAt: undefined | null | Date;

  public constructor(
    password: string,
    apiKey: undefined | string,
    expiredAt: undefined | null | Date,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.password = password;
    this.apiKey = apiKey;
    this.expiredAt = expiredAt;
  }
}
