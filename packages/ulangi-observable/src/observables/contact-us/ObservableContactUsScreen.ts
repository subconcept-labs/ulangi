/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ContactUsFormType, ScreenName } from '@ulangi/ulangi-common/enums';
import { ScreenTitle } from '@ulangi/ulangi-common/interfaces';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';

export class ObservableContactUsScreen extends ObservableScreen {
  @observable
  public formType: ContactUsFormType;

  @observable
  public text: string;

  public constructor(
    formType: ContactUsFormType,
    text: string,
    screenName: ScreenName,
    screenTitle: ScreenTitle
  ) {
    super(screenName, screenTitle);
    this.formType = formType;
    this.text = text;
  }
}
