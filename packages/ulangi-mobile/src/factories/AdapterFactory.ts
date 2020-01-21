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
  FileSystemAdapter,
  FirebaseAdapter,
  IapAdapter,
  NetInfoAdapter,
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
  netInfo: NetInfoAdapter;
  fileSystem: FileSystemAdapter;
  iap: IapAdapter;
}

export class AdapterFactory {
  public createAdapters(): AdapterList {
    const adMob = new AdMobAdapter((RNFirebase as any).admob, RNAdConsent);
    const analytics = new AnalyticsAdapter(RNFirebase.analytics());
    const audioPlayer = new AudioPlayerAdapter(RNAudioPlayer);
    const crashlytics = new CrashlyticsAdapter(RNFirebase.crashlytics());
    const facebook = new FacebookAdapter(RNFacebook);
    const fileSystem = new FileSystemAdapter(RNFileSystem);
    const firebase = new FirebaseAdapter(RNFirebase);
    const iap = new IapAdapter(RNIap);
    const netInfo = new NetInfoAdapter(RNNetInfo);
    const notifications = new NotificationsAdapter(
      RNFirebase.notifications(),
      RNFirebase.messaging(),
      RNFirebase.notifications,
    );
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
