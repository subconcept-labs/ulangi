/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import { ApiScope } from '@ulangi/ulangi-common/enums';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { ApiKeyRow } from '../interfaces/ApiKeyRow';

export class ApiKeyRowResolver extends AbstractResolver<ApiKeyRow> {
  protected rules = {
    apiKey: Joi.string(),
    apiScope: Joi.string().valid(_.values(ApiScope)),
    userId: Joi.string(),
    expiredAt: Joi.date().allow(null),
  };
}
