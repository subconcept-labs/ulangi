/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableQuickTutorialScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class QuickTutorialScreenDelegate {
  private observableScreen: ObservableQuickTutorialScreen;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableQuickTutorialScreen,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.navigatorDelegate = navigatorDelegate;
  }

  public setSlideIndex(index: number): void {
    this.observableScreen.currentIndex = index;
  }

  public back(): void {
    this.navigatorDelegate.pop();
  }
}
