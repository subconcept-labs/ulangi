import RNNetInfo from '@react-native-community/netinfo';
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
import { Platform } from 'react-native';
import * as RNDarkMode from 'react-native-dark-mode';
import * as RNFileSystem from 'react-native-fs';
import * as RNSqlite from 'react-native-sqlite-storage';

import RNAudioPlayer = require('react-native-sound');

export interface AdapterList {
  adMob: null | AdMobAdapter;
  analytics: null | AnalyticsAdapter;
  audioPlayer: AudioPlayerAdapter;
  crashlytics: null | CrashlyticsAdapter;
  facebook: null | FacebookAdapter;
  fileSystem: FileSystemAdapter;
  firebase: null | FirebaseAdapter;
  iap: null | IapAdapter;
  netInfo: NetInfoAdapter;
  notifications: null | NotificationsAdapter;
  sqliteDatabase: SQLiteDatabaseAdapter;
  systemTheme: SystemThemeAdapter;
}

export class AdapterFactory {
  public createAdapters(): AdapterList {
    const adMob = null;
    const analytics = null;
    const audioPlayer = new AudioPlayerAdapter(
      Platform.OS === 'ios' ? 'ios' : 'other',
      RNAudioPlayer,
    );
    const crashlytics = null;
    const facebook = null;
    const fileSystem = new FileSystemAdapter(RNFileSystem);
    const firebase = null;
    const iap = null;
    const netInfo = new NetInfoAdapter(RNNetInfo);
    const notifications = null;
    const sqliteDatabase = new SQLiteDatabaseAdapter(RNSqlite);
    const systemTheme = new SystemThemeAdapter(RNDarkMode);

    return {
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
      sqliteDatabase,
      systemTheme,
    };
  }
}
