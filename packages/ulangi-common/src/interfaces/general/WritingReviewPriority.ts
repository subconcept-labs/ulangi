/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ReviewPriority } from '../../enums/ReviewPriority';
import { SetExtraDataName } from '../../enums/SetExtraDataName';

export interface WritingReviewPriority {
  readonly dataName: SetExtraDataName.WRITING_REVIEW_PRIORITY;
  readonly dataValue: ReviewPriority;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: null | Date;
  readonly lastSyncedAt: null | Date;
}
