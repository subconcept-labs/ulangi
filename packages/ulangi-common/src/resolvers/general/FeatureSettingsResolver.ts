/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { FeatureSettings } from '../../interfaces/general/FeatureSettings';

export class FeatureSettingsResolver extends AbstractResolver<FeatureSettings> {
  protected rules = {
    spacedRepetitionEnabled: Joi.boolean(),
    writingEnabled: Joi.boolean(),
    quizEnabled: Joi.boolean(),
    reflexEnabled: Joi.boolean(),
    atomEnabled: Joi.boolean(),
  };
}
