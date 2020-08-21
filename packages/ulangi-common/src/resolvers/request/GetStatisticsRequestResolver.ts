/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { GetStatisticsRequest } from '../../interfaces/request/GetStatisticsRequest';
import { RequestResolver } from './RequestResolver';

export class GetStatisticsRequestResolver extends RequestResolver<
  GetStatisticsRequest
> {
  protected rules = {
    query: {
      currentLocalTime: Joi.date(),
    },
    body: Joi.strip(),
  };
}
