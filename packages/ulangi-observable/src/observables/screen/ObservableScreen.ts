/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName, ScreenState } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableTouchableTopBar } from '../top-bar/ObservableTouchableTopBar';
import { ObservableScreenLayout } from './ObservableScreenLayout';

export class ObservableScreen {
  public readonly componentId: string;

  @observable
  public screenName: ScreenName;

  @observable
  public topBar: null | ObservableTitleTopBar | ObservableTouchableTopBar;

  @observable
  public screenState: ScreenState = ScreenState.UNMOUNTED;

  @observable
  public readonly screenLayout: ObservableScreenLayout;

  public constructor(
    componentId: string,
    screenName: ScreenName,
    topBar: null | ObservableTitleTopBar | ObservableTouchableTopBar,
    screenLayout?: ObservableScreenLayout
  ) {
    this.componentId = componentId;
    this.screenName = screenName;
    this.topBar = topBar;
    this.screenLayout = screenLayout || new ObservableScreenLayout(0, 0);
  }
}
