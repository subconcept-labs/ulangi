/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SyncDelegate } from '@ulangi/ulangi-delegate';
import { boundClass } from 'autobind-decorator';

@boundClass
export class SynchronizerScreenDelegate {
  private syncDelegate: SyncDelegate;

  public constructor(syncDelegate: SyncDelegate) {
    this.syncDelegate = syncDelegate;
  }

  public triggerSync(): void {
    this.syncDelegate.syncEverything();
  }
}
