/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';
import * as RNDarkMode from 'react-native-dark-mode';
import { EventChannel, eventChannel } from 'redux-saga';

export class SystemDarkModeAdapter {
  public systemDarkMode: typeof RNDarkMode;

  public constructor(systemDarkMode: typeof RNDarkMode) {
    this.systemDarkMode = systemDarkMode;
  }

  public createEventChannel(): EventChannel<Theme> {
    return eventChannel(
      (emit): (() => void) => {
        this.systemDarkMode.eventEmitter.on(
          'currentModeChanged',
          (newMode): void => {
            if (newMode === 'light') {
              emit(Theme.LIGHT);
            } else if (newMode === 'dark') {
              emit(Theme.DARK);
            } else {
              emit(newMode);
            }
          }
        );

        return _.noop;
      }
    );
  }
}
