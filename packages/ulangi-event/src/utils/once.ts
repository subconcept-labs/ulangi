/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionPayload } from '@ulangi/ulangi-action';

import { Event } from '../interfaces/Event';
import { EventListener } from '../types/EventListener';

export function once<K extends keyof ActionPayload>(
  actionType: K,
  callback: (args: ActionPayload[K]) => void
): EventListener {
  return (event: Event, unsubscribe: () => void): void => {
    if (event.action.is(actionType)) {
      unsubscribe();
      callback(event.action.payload);
    }
  };
}
