/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AtomShellType } from '@ulangi/ulangi-common/enums';
import { ObservableShell } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class ShellFactory {
  public make(originPosition: { x: number; y: number }): ObservableShell[] {
    const shells: ObservableShell[] = [];

    shells.push(
      new ObservableShell(
        AtomShellType.INNER,
        config.atom.innerShellDiameter,
        originPosition,
        null,
        10,
      ),
      new ObservableShell(
        AtomShellType.OUTER,
        config.atom.outerShellDiameter,
        originPosition,
        null,
        20,
      ),
    );

    return shells;
  }
}
