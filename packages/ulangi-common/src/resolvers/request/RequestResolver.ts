/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';

import { Request } from '../../interfaces/request/Request';

export abstract class RequestResolver<
  T extends Request
> extends AbstractResolver<Pick<T, 'query' | 'body'>> {}
