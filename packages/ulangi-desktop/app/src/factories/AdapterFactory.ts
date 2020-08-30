import { SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import {
  AdMobAdapter,
  AnalyticsAdapter,
  AudioPlayerAdapter,
  CrashlyticsAdapter,
  FacebookAdapter,
  FileSystemAdapter,
  FirebaseAdapter,
  IapAdapter,
  NetInfoAdapter,
  NotificationsAdapter,
  SystemThemeAdapter,
} from '@ulangi/ulangi-saga';
import * as sqlite from 'sqlite3';

export interface AdapterList {
  sqliteDatabase: SQLiteDatabaseAdapter;
  adMob: null | AdMobAdapter;
  analytics: null | AnalyticsAdapter;
  audioPlayer: null | AudioPlayerAdapter;
  crashlytics: null | CrashlyticsAdapter;
  facebook: null | FacebookAdapter;
  fileSystem: null | FileSystemAdapter;
  firebase: null | FirebaseAdapter;
  iap: null | IapAdapter;
  netInfo: null | NetInfoAdapter;
  notifications: null | NotificationsAdapter;
  systemTheme: null | SystemThemeAdapter;
}

export class AdapterFactory {
  public createAdapters(): AdapterList {
    const sqliteDatabase = new SQLiteDatabaseAdapter(sqlite);

    const adMob = null;
    const analytics = null;
    const audioPlayer = null;
    const crashlytics = null;
    const facebook = null;
    const fileSystem = null;
    const firebase = null;
    const iap = null;
    const netInfo = null;
    const notifications = null;
    const systemTheme = null;

    return {
      sqliteDatabase,
      adMob,
      analytics,
      audioPlayer,
      crashlytics,
      facebook,
      fileSystem,
      firebase,
      iap,
      netInfo,
      notifications,
      systemTheme,
    };
  }
}
