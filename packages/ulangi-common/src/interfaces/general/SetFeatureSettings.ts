/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetExtraDataName } from '../../enums/SetExtraDataName';
import { FeatureSettings } from './FeatureSettings';

export interface SetFeatureSettings {
  readonly dataName: SetExtraDataName.SET_FEATURE_SETTINGS;
  readonly dataValue: FeatureSettings;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: null | Date;
  readonly lastSyncedAt: null | Date;
}
