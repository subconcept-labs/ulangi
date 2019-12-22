/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ScreenTitle } from '@ulangi/ulangi-common/interfaces';
import { action, computed, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';

export class ObservableQuickTutorialScreen extends ObservableScreen {
  @observable
  public images: any[];

  @observable
  public currentIndex: number;

  @observable
  public sliderWidth?: number;

  @observable
  public sliderHeight?: number;

  @computed
  public get imageWidth(): undefined | number {
    return typeof this.sliderWidth !== 'undefined'
      ? this.sliderWidth - 16 * 2
      : undefined;
  }

  @computed
  public get imageHeight(): undefined | number {
    return typeof this.sliderHeight !== 'undefined'
      ? this.sliderHeight
      : undefined;
  }

  public constructor(
    images: any[],
    currentIndex: number,
    screenName: ScreenName,
    screenTitle?: ScreenTitle
  ) {
    super(screenName, screenTitle);
    this.images = images;
    this.currentIndex = currentIndex;
  }

  @action
  public setSliderDimension(width: number, height: number): void {
    this.sliderWidth = width;
    this.sliderHeight = height;
  }
}
