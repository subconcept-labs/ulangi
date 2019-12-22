/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SetRow } from '../interfaces/SetRow';

export class SetRowResolver extends AbstractResolver<SetRow> {
  protected rules = {
    setId: Joi.string(),
    userId: Joi.string(),
    setName: Joi.string(),
    setStatus: Joi.string(),
    learningLanguageCode: Joi.string(),
    translatedToLanguageCode: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    updatedStatusAt: Joi.date(),
    firstSyncedAt: Joi.date(),
    lastSyncedAt: Joi.date(),
  };
}
