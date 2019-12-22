/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SyncConfig } from '../../interfaces/general/SyncConfig';

export class SyncConfigResolver extends AbstractResolver<SyncConfig> {
  protected rules = {
    uploadLimit: Joi.number(),
    downloadLimit: Joi.number(),
    minDelay: Joi.number(),
    maxDelay: Joi.number(),
    incrementDelayOnError: Joi.number(),
  };
}
