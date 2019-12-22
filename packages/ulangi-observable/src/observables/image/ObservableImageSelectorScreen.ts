/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableArray, IObservableValue, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservablePixabayImage } from './ObservablePixabayImage';

export class ObservableImageSelectorScreen extends ObservableScreen {
  @observable
  public input: IObservableValue<string>;

  @observable
  public searchState: IObservableValue<ActivityState>;

  @observable
  public images: null | IObservableArray<ObservablePixabayImage>;

  @observable
  public noMore: IObservableValue<boolean>;

  @observable
  public isRefreshing: IObservableValue<boolean>;

  public constructor(
    input: IObservableValue<string>,
    searchState: IObservableValue<ActivityState>,
    images: null | IObservableArray<ObservablePixabayImage>,
    noMore: IObservableValue<boolean>,
    isRefreshing: IObservableValue<boolean>,
    screenName: ScreenName
  ) {
    super(screenName);
    this.input = input;
    this.searchState = searchState;
    this.images = images;
    this.noMore = noMore;
    this.isRefreshing = isRefreshing;
  }
}
