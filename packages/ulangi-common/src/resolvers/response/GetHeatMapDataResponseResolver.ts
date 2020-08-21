/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { GetHeatMapDataResponse } from '../../interfaces/response/GetHeatMapDataResponse';

export class GetHeatMapDataResponseResolver extends AbstractResolver<
  GetHeatMapDataResponse
> {
  protected rules = {
    data: Joi.array().items([Joi.string(), Joi.allow(null)]),
  };
}
