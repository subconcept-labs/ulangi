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

export class SystemThemeAdapter {
  public systemTheme: typeof RNDarkMode;

  public constructor(systemTheme: typeof RNDarkMode) {
    this.systemTheme = systemTheme;
  }

  public createEventChannel(): EventChannel<Theme> {
    return eventChannel(
      (emit): (() => void) => {
        this.systemTheme.eventEmitter.on(
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
