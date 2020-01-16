/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { ThemeTrigger } from '../../enums/ThemeTrigger';
import { ThemeSettings } from '../../interfaces/general/ThemeSettings';

export class ThemeSettingsResolver extends AbstractResolver<ThemeSettings> {
  protected rules = {
    trigger: Joi.string().valid(_.values(ThemeTrigger)),
  };
}
