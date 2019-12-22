/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { UserExtraDataName } from '../../enums/UserExtraDataName';
import { GlobalDarkMode } from '../../interfaces/general/GlobalDarkMode';
import { DarkModeSettingsResolver } from './DarkModeSettingsResolver';

export class GlobalDarkModeResolver extends AbstractResolver<GlobalDarkMode> {
  private darkModeSettingsResolver = new DarkModeSettingsResolver();

  protected rules = {
    dataName: Joi.string().valid(UserExtraDataName.GLOBAL_DARK_MODE),
    dataValue: Joi.object(this.darkModeSettingsResolver.getRules()),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
