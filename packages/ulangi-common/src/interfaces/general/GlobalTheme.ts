/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserExtraDataName } from '../../enums/UserExtraDataName';
import { ThemeSettings } from '../../interfaces/general/ThemeSettings';

export interface GlobalTheme {
  readonly dataName: UserExtraDataName.GLOBAL_THEME;
  readonly dataValue: ThemeSettings;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: null | Date;
  readonly lastSyncedAt: null | Date;
}
