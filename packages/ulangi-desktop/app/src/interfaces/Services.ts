/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { EventBusFactory } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableLightBox,
  ObservableRootNavigation,
  ObservableRootStore,
  ObservableScreenRegistry,
} from '@ulangi/ulangi-observable';

export interface Services {
  readonly eventBusFactory: EventBusFactory;
  readonly rootStore: ObservableRootStore;
  readonly rootNavigation: ObservableRootNavigation;
  readonly observableConverter: ObservableConverter;
  readonly observableScreenRegistry: ObservableScreenRegistry;
  readonly observableLightBox: ObservableLightBox;
}
