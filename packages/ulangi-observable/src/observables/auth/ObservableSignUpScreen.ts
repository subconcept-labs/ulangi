/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableValue, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';

export class ObservableSignUpScreen extends ObservableScreen {
  public email: IObservableValue<string>;
  public password: IObservableValue<string>;
  public confirmPassword: IObservableValue<string>;

  public shouldFocusPassword: IObservableValue<boolean>;
  public shouldFocusConfirmPassword: IObservableValue<boolean>;

  public constructor(
    email: string,
    password: string,
    confirmPassword: string,
    shouldFocusPassword: boolean,
    shouldFocusConfirmPassword: boolean,
    screenName: ScreenName
  ) {
    super(screenName);

    this.email = observable.box(email);
    this.password = observable.box(password);
    this.confirmPassword = observable.box(confirmPassword);
    this.shouldFocusPassword = observable.box(shouldFocusPassword);
    this.shouldFocusConfirmPassword = observable.box(
      shouldFocusConfirmPassword
    );
  }
}
