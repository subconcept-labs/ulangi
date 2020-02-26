/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableArray, IObservableValue, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservablePixabayImage } from './ObservablePixabayImage';

export class ObservableImageSelectorScreen extends ObservableScreen {
  @observable
  public screenAppearedTimes: number;

  @observable
  public input: IObservableValue<string>;

  @observable
  public shouldFocusInput: IObservableValue<boolean>;

  @observable
  public searchState: IObservableValue<ActivityState>;

  @observable
  public images: null | IObservableArray<ObservablePixabayImage>;

  @observable
  public noMore: IObservableValue<boolean>;

  @observable
  public isRefreshing: IObservableValue<boolean>;

  public constructor(
    screenAppearedTimes: number,
    input: IObservableValue<string>,
    shouldFocusInput: IObservableValue<boolean>,
    searchState: IObservableValue<ActivityState>,
    images: null | IObservableArray<ObservablePixabayImage>,
    noMore: IObservableValue<boolean>,
    isRefreshing: IObservableValue<boolean>,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.screenAppearedTimes = screenAppearedTimes;
    this.input = input;
    this.shouldFocusInput = shouldFocusInput;
    this.searchState = searchState;
    this.images = images;
    this.noMore = noMore;
    this.isRefreshing = isRefreshing;
  }
}
