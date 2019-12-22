/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AdConfig } from './AdConfig';
import { AppConfig } from './AppConfig';
import { Language } from './Language';
import { LanguagePair } from './LanguagePair';
import { SyncConfig } from './SyncConfig';

export interface RemoteConfig {
  readonly languages: readonly Language[];
  readonly supportedLanguagePairs: readonly LanguagePair[];
  readonly app: AppConfig;
  readonly ad: AdConfig;
  readonly sync: SyncConfig;
}
