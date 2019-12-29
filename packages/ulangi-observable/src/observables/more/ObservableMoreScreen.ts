/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableArray, IObservableValue, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableCarouselMessage } from './ObservableCarouselMessage';

export class ObservableMoreScreen extends ObservableScreen {
  @observable
  public messages: IObservableArray<ObservableCarouselMessage>;

  @observable
  public currentMessageIndex: IObservableValue<number>;

  public constructor(
    messages: IObservableArray<ObservableCarouselMessage>,
    currentMessageIndex: IObservableValue<number>,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(screenName, topBar);
    this.messages = messages;
    this.currentMessageIndex = currentMessageIndex;
  }
}
