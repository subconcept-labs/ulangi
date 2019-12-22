/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { EventBusFactory } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableKeyboard,
  ObservableLightBox,
  ObservableRootStore,
  ObservableScreenRegistry,
} from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';

export interface Services {
  readonly eventBusFactory: EventBusFactory;
  readonly rootStore: ObservableRootStore;
  readonly observableConverter: ObservableConverter;
  readonly observableLightBox: ObservableLightBox;
  readonly observableKeyboard: ObservableKeyboard;
  readonly observableScreenRegistry: ObservableScreenRegistry;
  readonly analytics: AnalyticsAdapter;
}
