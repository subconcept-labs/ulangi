/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SetExtraDataName } from '../../enums/SetExtraDataName';
import { SetFeatureSettings } from '../../interfaces/general/SetFeatureSettings';
import { FeatureSettingsResolver } from '../general/FeatureSettingsResolver';

export class SetFeatureSettingsResolver extends AbstractResolver<
  SetFeatureSettings
> {
  private featureSettings = new FeatureSettingsResolver();

  protected rules = {
    dataName: Joi.string().valid(SetExtraDataName.SET_FEATURE_SETTINGS),
    dataValue: Joi.object(this.featureSettings.getRules()),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
