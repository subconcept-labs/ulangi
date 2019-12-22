/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { UserExtraDataName } from '../../enums/UserExtraDataName';
import { GlobalReminder } from '../../interfaces/general/GlobalReminder';
import { ReminderSettingsResolver } from './ReminderSettingsResolver';

export class GlobalReminderResolver extends AbstractResolver<GlobalReminder> {
  protected reminderSettingsResolver = new ReminderSettingsResolver();

  protected rules = {
    dataName: Joi.string().valid(UserExtraDataName.GLOBAL_REMINDER),
    dataValue: Joi.object(this.reminderSettingsResolver.getRules()),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
