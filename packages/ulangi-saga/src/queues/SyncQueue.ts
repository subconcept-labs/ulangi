/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SyncTask } from '@ulangi/ulangi-common/enums';
import * as EventEmitter from 'eventemitter3';
import * as _ from 'lodash';
import { EventChannel, eventChannel } from 'redux-saga';

export class SyncQueue {
  private queue: SyncTask[] = [];
  private priorityMap: Map<SyncTask, number>;
  private eventEmitter = new EventEmitter();

  public constructor(priority: [SyncTask, number][]) {
    this.priorityMap = new Map(priority);
  }

  public shift(): undefined | SyncTask {
    return this.queue.shift();
  }

  public add(syncTask: SyncTask): void {
    this.queue.push(syncTask);
    this.queue = _.uniq(this.queue);
    this.sortQueueByPriority();

    // Execute callbacks
    this.eventEmitter.emit('SYNC_TASK_ADDED', syncTask);
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }

  public createChannel(eventName: 'SYNC_TASK_ADDED'): EventChannel<SyncTask> {
    return eventChannel(
      (emitter): (() => EventEmitter) => {
        const listener = (syncTask: SyncTask): void => {
          emitter(syncTask);
        };
        this.eventEmitter.addListener(eventName, listener);
        return (): EventEmitter =>
          this.eventEmitter.removeListener(eventName, listener);
      }
    );
  }

  private sortQueueByPriority(): void {
    this.queue.sort(
      (a, b): number => {
        const priorityOfA = assertExists(this.priorityMap.get(a));
        const priorityOfB = assertExists(this.priorityMap.get(b));

        return priorityOfA - priorityOfB;
      }
    );
  }
}
