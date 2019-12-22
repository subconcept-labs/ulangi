/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action } from './Action';
import { ActionPayload } from './ActionPayload';

export class InferableAction implements Action<any> {
  public readonly type: string;
  public readonly payload: null | object;

  public constructor(type: string, payload: null | object) {
    this.type = type;
    this.payload = payload;
  }

  public is<U extends keyof ActionPayload>(type: U): this is Action<U> {
    return this.type === type;
  }
}
