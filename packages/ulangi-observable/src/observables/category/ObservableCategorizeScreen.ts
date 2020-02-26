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

export class ObservableCategorizeScreen extends ObservableScreen {
  public readonly categoryFormState: ObservableCategoryFormState;

  public constructor(
    categoryFormState: ObservableCategoryFormState,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.categoryFormState = categoryFormState;
  }
}
