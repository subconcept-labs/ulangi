/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface ContainerOptions {
  readonly autoBindNavigationEvent: boolean;
  readonly autoUpdateObservableScreen: boolean;
  readonly autoUpdateObservableLightBox: boolean;
  readonly autoUnsubscribeEventBus: boolean;
  readonly autoUnsubscribeObserver: boolean;
  readonly autoCloseSplashScreen: boolean;
}
