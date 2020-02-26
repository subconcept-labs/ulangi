/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableValue, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';

export class ObservableSignInScreen extends ObservableScreen {
  public email: IObservableValue<string>;

  public password: IObservableValue<string>;

  public shouldFocusPassword: IObservableValue<boolean>;

  public constructor(
    email: string,
    password: string,
    shouldFocusPassword: boolean,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.email = observable.box(email);
    this.password = observable.box(password);
    this.shouldFocusPassword = observable.box(shouldFocusPassword);
  }
}
