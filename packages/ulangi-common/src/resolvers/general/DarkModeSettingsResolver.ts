/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { DarkModeTrigger } from '../../enums/DarkModeTrigger';
import { DarkModeSettings } from '../../interfaces/general/DarkModeSettings';

export class DarkModeSettingsResolver extends AbstractResolver<
  DarkModeSettings
> {
  protected rules = {
    trigger: Joi.string().valid(_.values(DarkModeTrigger)),
  };
}
