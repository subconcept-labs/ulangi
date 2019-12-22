/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as EventEmitter from 'eventemitter3';

import { DatabaseEvent } from '../enums/DatabaseEvent';

export class DatabaseEventBus {
  private eventEmitter = new EventEmitter();

  public publish(databaseEvent: DatabaseEvent): void {
    this.eventEmitter.emit('DATABASE_EVENT', databaseEvent);
  }

  public subscribe(
    listener: (databaseEvent: DatabaseEvent) => void
  ): () => void {
    this.eventEmitter.on('DATABASE_EVENT', listener);

    return (): void => this.unsubscribe(listener);
  }

  public unsubscribe(listener: (databaseEvent: DatabaseEvent) => void): void {
    this.eventEmitter.off('DATABASE_EVENT', listener);
  }
}
