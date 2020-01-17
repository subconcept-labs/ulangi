import { ErrorCode } from '@ulangi/ulangi-common/enums';
import { AnalyticsAdapter, CrashlyticsAdapter } from '@ulangi/ulangi-saga';
import * as _ from 'lodash';

export class RemoteLogger {
  private static analytics: null | AnalyticsAdapter;
  private static crashlytics: null | CrashlyticsAdapter;

  public static useCrashlytics(crashlytics: CrashlyticsAdapter): void {
    RemoteLogger.crashlytics = crashlytics;
  }

  public static useAnalytics(analytics: AnalyticsAdapter): void {
    RemoteLogger.analytics = analytics;
  }

  public static logEvent(event: string, params?: object): void {
    if (RemoteLogger.analytics !== null) {
      RemoteLogger.analytics.logEvent(event, params);
    } else {
      console.warn(
        `Cannot log event ${event} remotely because Analytics is not set.`,
      );
    }
  }

  public static logError(error: unknown): void {
    if (RemoteLogger.crashlytics !== null) {
      if (error instanceof Error) {
        RemoteLogger.crashlytics.recordCustomError(error.name, error.message);
      } else {
        try {
          RemoteLogger.crashlytics.recordCustomError(
            ErrorCode.GENERAL__UNKNOWN_ERROR,
            JSON.stringify(error),
          );
        } catch (err) {
          RemoteLogger.crashlytics.recordCustomError(
            ErrorCode.GENERAL__UNKNOWN_ERROR,
            _.toString(error),
          );
        }
      }
    } else {
      console.warn(
        `Cannot log error ${error} remotely because Crashlytics is not set.`,
      );
    }
  }
}
