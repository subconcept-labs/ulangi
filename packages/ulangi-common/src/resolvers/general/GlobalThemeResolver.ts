/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { UserExtraDataName } from '../../enums/UserExtraDataName';
import { GlobalTheme } from '../../interfaces/general/GlobalTheme';
import { ThemeSettingsResolver } from './ThemeSettingsResolver';

export class GlobalThemeResolver extends AbstractResolver<GlobalTheme> {
  private themeSettingsResolver = new ThemeSettingsResolver();

  protected rules = {
    dataName: Joi.string().valid(UserExtraDataName.GLOBAL_THEME),
    dataValue: Joi.object(this.themeSettingsResolver.getRules()),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
