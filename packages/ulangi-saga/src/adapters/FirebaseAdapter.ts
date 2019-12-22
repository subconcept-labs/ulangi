/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Firebase, RNFirebase } from '@ulangi/react-native-firebase';

export class FirebaseAdapter {
  private firebase: Firebase;

  public constructor(firebase: Firebase) {
    this.firebase = firebase;
  }

  public signInWithCustomToken(
    firebaseToken: string
  ): Promise<RNFirebase.UserCredential> {
    return this.firebase.auth().signInWithCustomToken(firebaseToken);
  }

  public signOut(): Promise<void> {
    return this.firebase.auth().signOut();
  }

  // eslint-disable-next-line
  public addListener(
    path: string,
    callback: RNFirebase.database.QuerySuccessCallback,
    errorCallback: RNFirebase.database.QueryErrorCallback
  ) {
    return this.firebase
      .database()
      .ref(path)
      .on('value', callback, errorCallback);
  }

  // eslint-disable-next-line
  public removeListener(
    path: string,
    callback: RNFirebase.database.QuerySuccessCallback
  ) {
    return this.firebase
      .database()
      .ref(path)
      .off('value', callback);
  }

  public removeListeners(
    pathListenerPairs: readonly [
      string,
      RNFirebase.database.QuerySuccessCallback
    ][]
  ): void {
    pathListenerPairs.forEach(
      ([path, listener]): void => {
        this.removeListener(path, listener);
      }
    );
  }
}
