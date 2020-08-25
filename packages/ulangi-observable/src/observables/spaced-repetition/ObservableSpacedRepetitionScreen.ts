/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableArray, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTouchableTopBar } from '../top-bar/ObservableTouchableTopBar';

export class ObservableSpacedRepetitionScreen extends ObservableScreen {
  @observable
  public selectedCategoryNames: undefined | IObservableArray<string>;

  @observable
  public counts:
    | undefined
    | {
        due: number;
        new: number;
      };

  public constructor(
    selectedCategoryNames: undefined | readonly string[],
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTouchableTopBar
  ) {
    super(componentId, screenName, topBar);
    this.selectedCategoryNames =
      typeof selectedCategoryNames !== 'undefined'
        ? observable.array(selectedCategoryNames.slice())
        : undefined;
  }
}
