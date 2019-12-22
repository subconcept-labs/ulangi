/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from '@ulangi/ulangi-common/interfaces';
import { RequestResolver } from '@ulangi/ulangi-common/resolvers';

import { AuthenticationStrategy } from '../enums/AuthenticationStrategy';

export interface ControllerOptions<T extends Request> {
  paths: readonly T['path'][];
  allowedMethod: T['method'];
  authStrategies: T['authRequired'] extends true
    ? readonly AuthenticationStrategy[]
    : null;
  requestResolver: T extends { query: null; body: null }
    ? null
    : T extends { query: object } | { body: object }
    ? RequestResolver<T>
    : null | RequestResolver<T>;
}
