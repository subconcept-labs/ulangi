/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { DownloadSetsRequest } from '../../interfaces/request/DownloadSetsRequest';
import { RequestResolver } from './RequestResolver';

export class DownloadSetsRequestResolver extends RequestResolver<
  DownloadSetsRequest
> {
  protected rules = {
    query: {
      startAt: Joi.date().optional(),
      softLimit: Joi.number(),
    },
    body: Joi.strip(),
  };
}
