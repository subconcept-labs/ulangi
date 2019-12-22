/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Event } from '../interfaces/Event';
import { EventListener } from '../types/EventListener';

export function group(...listeners: EventListener[]): EventListener {
  return (event: Event, unsubscribe: () => void): void => {
    listeners.forEach(
      (listener): void => {
        listener(event, unsubscribe);
      }
    );
  };
}
