/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { DownloadSpecificSetsRequest } from '../../interfaces/request/DownloadSpecificSetsRequest';
import { RequestResolver } from './RequestResolver';

export class DownloadSpecificSetsRequestResolver extends RequestResolver<
  DownloadSpecificSetsRequest
> {
  protected rules = {
    query: Joi.strip(),
    body: {
      setIds: Joi.array().items(Joi.string()),
    },
  };
}
