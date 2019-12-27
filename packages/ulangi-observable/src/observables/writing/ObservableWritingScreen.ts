/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableArray, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';

export class ObservableWritingScreen extends ObservableScreen {
  @observable
  public selectedCategoryNames: undefined | IObservableArray<string>;

  public constructor(
    selectedCategoryNames: undefined | readonly string[],
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(screenName, topBar);
    this.selectedCategoryNames =
      typeof selectedCategoryNames !== 'undefined'
        ? observable.array(selectedCategoryNames.slice())
        : undefined;
  }
}
