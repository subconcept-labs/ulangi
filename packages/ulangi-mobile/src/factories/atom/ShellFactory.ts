/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AtomShellType } from '@ulangi/ulangi-common/enums';
import { ObservableOrigin, ObservableShell } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class ShellFactory {
  public make(origin: ObservableOrigin): ObservableShell[] {
    const shells: ObservableShell[] = [];

    shells.push(
      new ObservableShell(
        origin,
        AtomShellType.INNER,
        config.atom.innerShellDiameter,
        null,
        10,
      ),
      new ObservableShell(
        origin,
        AtomShellType.OUTER,
        config.atom.outerShellDiameter,
        null,
        20,
      ),
    );

    return shells;
  }
}
