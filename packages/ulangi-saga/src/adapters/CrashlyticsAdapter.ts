/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { RNFirebase } from '@ulangi/react-native-firebase';

export class CrashlyticsAdapter {
  public crashlytics: RNFirebase.crashlytics.Crashlytics;

  public constructor(crashlytics: RNFirebase.crashlytics.Crashlytics) {
    this.crashlytics = crashlytics;
  }

  public enableCrashlyticsCollection(): void {
    this.crashlytics.enableCrashlyticsCollection();
  }

  public recordCustomError(
    name: string,
    message: string,
    stack?: RNFirebase.crashlytics.customError[]
  ): void {
    this.crashlytics.recordCustomError(name, message, stack);
  }
}
