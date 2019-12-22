/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserExtraDataName } from '../../enums/UserExtraDataName';
import { ReminderSettings } from './ReminderSettings';

export interface GlobalReminder {
  readonly dataName: UserExtraDataName.GLOBAL_REMINDER;
  readonly dataValue: ReminderSettings;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: null | Date;
  readonly lastSyncedAt: null | Date;
}
