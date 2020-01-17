import RNNetInfo from '@react-native-community/netinfo';
import RNAdConsent from '@ulangi/react-native-ad-consent';
import RNFirebase from '@ulangi/react-native-firebase';
import { SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import {
  AdMobAdapter,
  AnalyticsAdapter,
  AudioPlayerAdapter,
  CrashlyticsAdapter,
  FacebookAdapter,
  FirebaseAdapter,
  NotificationsAdapter,
  SystemThemeAdapter,
} from '@ulangi/ulangi-saga';
import * as RNDarkMode from 'react-native-dark-mode';
import * as RNFacebook from 'react-native-fbsdk';
import * as RNFileSystem from 'react-native-fs';
import * as RNIap from 'react-native-iap';
import * as RNSqlite from 'react-native-sqlite-storage';

import RNAudioPlayer = require('react-native-sound');

export interface AdapterList {
  sqliteDatabase: SQLiteDatabaseAdapter;
  firebase: FirebaseAdapter;
  analytics: AnalyticsAdapter;
  crashlytics: CrashlyticsAdapter;
  adMob: AdMobAdapter;
  facebook: FacebookAdapter;
  audioPlayer: AudioPlayerAdapter;
  notifications: NotificationsAdapter;
  systemTheme: SystemThemeAdapter;

  // Missing adapters
  RNNetInfo: typeof RNNetInfo;
  RNFileSystem: typeof RNFileSystem;
  RNIap: typeof RNIap;
}

export class AdapterFactory {
  public createAdapters(): AdapterList {
    const sqliteDatabase = new SQLiteDatabaseAdapter(RNSqlite);
    const firebase = new FirebaseAdapter(RNFirebase);
    const analytics = new AnalyticsAdapter(RNFirebase.analytics());
    const crashlytics = new CrashlyticsAdapter(RNFirebase.crashlytics());
    // @ts-ignore
    const adMob = new AdMobAdapter(RNFirebase.admob, RNAdConsent);
    const facebook = new FacebookAdapter(RNFacebook);
    const audioPlayer = new AudioPlayerAdapter(RNAudioPlayer);
    const notifications = new NotificationsAdapter(
      RNFirebase.notifications(),
      RNFirebase.messaging(),
      RNFirebase.notifications,
    );
    const systemTheme = new SystemThemeAdapter(RNDarkMode);

    return {
      sqliteDatabase,
      firebase,
      analytics,
      crashlytics,
      adMob,
      facebook,
      audioPlayer,
      notifications,
      systemTheme,

      // Missing adapters
      RNNetInfo,
      RNFileSystem,
      RNIap,
    };
  }
}
