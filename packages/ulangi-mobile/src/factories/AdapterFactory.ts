import RNNetInfo from '@react-native-community/netinfo';
import RNFirebase from '@ulangi/react-native-firebase';
import { SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import {
  AnalyticsAdapter,
  AudioPlayerAdapter,
  CrashlyticsAdapter,
  FileSystemAdapter,
  FirebaseAdapter,
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
  analytics: null | AnalyticsAdapter;
  audioPlayer: AudioPlayerAdapter;
  crashlytics: null | CrashlyticsAdapter;
  fileSystem: FileSystemAdapter;
  firebase: null | FirebaseAdapter;
  netInfo: NetInfoAdapter;
  notifications: null | NotificationsAdapter;
  sqliteDatabase: SQLiteDatabaseAdapter;
  systemTheme: SystemThemeAdapter;
}

export class AdapterFactory {
  public createAdapters(): AdapterList {
    const analytics = new AnalyticsAdapter(RNFirebase.analytics());
    const audioPlayer = new AudioPlayerAdapter(
      Platform.OS === 'ios' ? 'ios' : 'other',
      RNAudioPlayer,
    );
    const crashlytics = new CrashlyticsAdapter(RNFirebase.crashlytics());
    const fileSystem = new FileSystemAdapter(RNFileSystem);
    const firebase = new FirebaseAdapter(RNFirebase);
    const netInfo = new NetInfoAdapter(RNNetInfo);
    const notifications = new NotificationsAdapter(
      RNFirebase.notifications(),
      RNFirebase.messaging(),
      RNFirebase.notifications,
    );
    const sqliteDatabase = new SQLiteDatabaseAdapter(RNSqlite);
    const systemTheme = new SystemThemeAdapter(RNDarkMode);

    return {
      analytics,
      audioPlayer,
      crashlytics,
      fileSystem,
      firebase,
      netInfo,
      notifications,
      sqliteDatabase,
      systemTheme,
    };
  }
}
