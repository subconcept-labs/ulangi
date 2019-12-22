/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action } from './Action';
import { ActionPayload } from './ActionPayload';

export function createAction<T extends keyof ActionPayload>(
  type: T,
  payload: ActionPayload[T]
): Action<T> {
  return {
    type,
    payload,
  };
}
