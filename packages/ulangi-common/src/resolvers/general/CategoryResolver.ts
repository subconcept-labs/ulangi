/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { Category } from '../../interfaces/general/Category';

export class CategoryResolver extends AbstractResolver<Category> {
  protected rules = {
    categoryName: Joi.string(),
    totalCount: Joi.number(),
    srLevel0Count: Joi.number(),
    srLevel1To3Count: Joi.number(),
    srLevel4To6Count: Joi.number(),
    srLevel7To8Count: Joi.number(),
    srLevel9To10Count: Joi.number(),
    wrLevel0Count: Joi.number(),
    wrLevel1To3Count: Joi.number(),
    wrLevel4To6Count: Joi.number(),
    wrLevel7To8Count: Joi.number(),
    wrLevel9To10Count: Joi.number(),
  };
}
