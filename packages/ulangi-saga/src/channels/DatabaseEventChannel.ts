/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DatabaseEvent, DatabaseEventBus } from '@ulangi/ulangi-local-database';
import { EventChannel, eventChannel } from 'redux-saga';

export class DatabaseEventChannel {
  private databaseEventBus: DatabaseEventBus;

  public constructor(databaseEventBus: DatabaseEventBus) {
    this.databaseEventBus = databaseEventBus;
  }

  public createChannel(): EventChannel<DatabaseEvent> {
    return eventChannel(
      (emit): (() => void) => {
        return this.databaseEventBus.subscribe(
          (databaseEvent): void => {
            emit(databaseEvent);
          }
        );
      }
    );
  }
}
