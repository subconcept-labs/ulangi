/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableSetFormState } from './ObservableSetFormState';

export class ObservableAddEditSetScreen extends ObservableScreen {
  public readonly setFormState: ObservableSetFormState;

  public constructor(
    setFormState: ObservableSetFormState,
    screenName: ScreenName
  ) {
    super(screenName);
    this.setFormState = setFormState;
  }
}
