/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { GetHeatMapDataRequest } from '../../interfaces/request/GetHeatMapDataRequest';
import { RequestResolver } from './RequestResolver';

export class GetHeatMapDataRequestResolver extends RequestResolver<
  GetHeatMapDataRequest
> {
  protected rules = {
    query: {
      startDate: Joi.date(),
      endDate: Joi.date(),
    },
    body: Joi.strip(),
  };
}
