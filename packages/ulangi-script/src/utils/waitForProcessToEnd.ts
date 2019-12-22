/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ChildProcess } from 'child_process';

export function waitForProcessToEnd(child: ChildProcess): Promise<void> {
  return new Promise(
    (resolve): void => {
      child.on(
        'close',
        (): void => {
          resolve();
        }
      );
    }
  );
}
