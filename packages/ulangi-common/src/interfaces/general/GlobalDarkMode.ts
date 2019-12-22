/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserExtraDataName } from '../../enums/UserExtraDataName';
import { DarkModeSettings } from '../../interfaces/general/DarkModeSettings';

export interface GlobalDarkMode {
  readonly dataName: UserExtraDataName.GLOBAL_DARK_MODE;
  readonly dataValue: DarkModeSettings;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: null | Date;
  readonly lastSyncedAt: null | Date;
}
