/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Readable, Writable } from 'stream';

export function waitForStreamToFinish(
  stream: Readable | Writable
): Promise<void> {
  return new Promise(
    (resolve): void => {
      stream.on(
        'finish',
        (): void => {
          resolve();
        }
      );
    }
  );
}
