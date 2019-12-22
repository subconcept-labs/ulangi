/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableQuickTutorialScreen } from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class QuickTutorialScreenDelegate {
  private observableScreen: ObservableQuickTutorialScreen;
  private navigatorDelegate: NavigatorDelegate;
  private analytics: AnalyticsAdapter;

  public constructor(
    observableScreen: ObservableQuickTutorialScreen,
    navigatorDelegate: NavigatorDelegate,
    analytics: AnalyticsAdapter
  ) {
    this.observableScreen = observableScreen;
    this.navigatorDelegate = navigatorDelegate;
    this.analytics = analytics;
  }

  public setSliderDimension(width: number, height: number): void {
    this.observableScreen.setSliderDimension(width, height);
  }

  public setSlideIndex(index: number): void {
    this.analytics.logEvent('slide_quick_tutorial');
    this.observableScreen.currentIndex = index;
  }

  public back(): void {
    this.navigatorDelegate.pop();
  }
}
