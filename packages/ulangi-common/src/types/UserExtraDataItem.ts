/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AutoShowInAppRating } from '../interfaces/general/AutoShowInAppRating';
import { GlobalAutoArchive } from '../interfaces/general/GlobalAutoArchive';
import { GlobalDataSharing } from '../interfaces/general/GlobalDataSharing';
import { GlobalReminder } from '../interfaces/general/GlobalReminder';
import { GlobalTheme } from '../interfaces/general/GlobalTheme';
import { UserRating } from '../interfaces/general/UserRating';

export type UserExtraDataItem =
  | GlobalAutoArchive
  | GlobalReminder
  | GlobalTheme
  | GlobalDataSharing
  | AutoShowInAppRating
  | UserRating;
