/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { RNFirebase } from '@ulangi/react-native-firebase';

export class AnalyticsAdapter {
  private analytics: RNFirebase.Analytics;

  public constructor(analytics: RNFirebase.Analytics) {
    this.analytics = analytics;
  }

  public logEvent(event: string, params?: object): void {
    this.analytics.logEvent(event, params);
  }
}
