/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { RNFirebase } from '@ulangi/react-native-firebase';
import { EventChannel, eventChannel } from 'redux-saga';

import { FirebaseAdapter } from '../adapters/FirebaseAdapter';

export class FirebaseEventChannel {
  private firebase: FirebaseAdapter;

  public constructor(firebase: FirebaseAdapter) {
    this.firebase = firebase;
  }

  public createChannelByPaths(
    paths: readonly string[]
  ): EventChannel<{ [P in string]: RNFirebase.database.DataSnapshot }> {
    return eventChannel(
      (emitter): (() => void) => {
        // Create listeners for each path
        const pathListenerPairs = paths.map(
          (
            path
          ): [string, (snapshot: RNFirebase.database.DataSnapshot) => void] => {
            return [path, (snapshot): void => emitter({ [path]: snapshot })];
          }
        );

        pathListenerPairs.forEach(
          ([path, listener]): void => {
            this.firebase.addListener(
              path,
              listener,
              (error: Error): void => {
                console.warn(error);
              }
            );
          }
        );

        return (): void => this.firebase.removeListeners(pathListenerPairs);
      }
    );
  }
}
