/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionPayload } from '@ulangi/ulangi-action';
import * as _ from 'lodash';

import { Event } from '../interfaces/Event';
import { EventListener } from '../types/EventListener';

export function on<K extends keyof ActionPayload>(
  actionType: K | K[],
  callback: (args: ActionPayload[K]) => void
): EventListener {
  return (event: Event): void => {
    if (_.isArray(actionType)) {
      actionType.forEach(
        (type): void => {
          if (event.action.is(type)) {
            callback(event.action.payload);
          }
        }
      );
    } else {
      if (event.action.is(actionType)) {
        callback(event.action.payload);
      }
    }
  };
}
