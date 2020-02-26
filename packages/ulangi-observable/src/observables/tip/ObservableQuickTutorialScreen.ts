/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';

export class ObservableQuickTutorialScreen extends ObservableScreen {
  @observable
  public images: any[];

  @observable
  public currentIndex: number;

  public constructor(
    images: any[],
    currentIndex: number,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.images = images;
    this.currentIndex = currentIndex;
  }
}
