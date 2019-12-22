/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { Config } from '../types/Config';

export class ConfigResolver extends AbstractResolver<Config> {
  protected rules = {
    shardDb: {
      shardDatabaseNamePrefix: Joi.string(),
    },

    library: {
      defaultLanguageCodePairs: Joi.array().items(Joi.string()),
      maxPerSet: Joi.number(),
    },

    dictionary: {
      defaultLanguageCodePairs: Joi.array().items(Joi.string()),
    },
  };
}
