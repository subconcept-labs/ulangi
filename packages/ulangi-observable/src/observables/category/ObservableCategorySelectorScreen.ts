/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableCategoryFormState } from './ObservableCategoryFormState';

export class ObservableCategorySelectorScreen extends ObservableScreen {
  public readonly categoryFormState: ObservableCategoryFormState;

  public constructor(
    categoryFormState: ObservableCategoryFormState,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(screenName, topBar);
    this.categoryFormState = categoryFormState;
  }
}
