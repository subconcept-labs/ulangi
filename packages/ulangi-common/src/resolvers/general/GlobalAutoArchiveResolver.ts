/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { UserExtraDataName } from '../../enums/UserExtraDataName';
import { GlobalAutoArchive } from '../../interfaces/general/GlobalAutoArchive';
import { AutoArchiveSettingsResolver } from './AutoArchiveSettingsResolver';

export class GlobalAutoArchiveResolver extends AbstractResolver<
  GlobalAutoArchive
> {
  protected autoArchiveSettingsResolver = new AutoArchiveSettingsResolver();

  protected rules = {
    dataName: Joi.string().valid(UserExtraDataName.GLOBAL_AUTO_ARCHIVE),
    dataValue: Joi.object(this.autoArchiveSettingsResolver.getRules()),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
