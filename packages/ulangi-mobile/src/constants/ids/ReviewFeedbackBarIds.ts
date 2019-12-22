/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback } from '@ulangi/ulangi-common/enums';

export const ReviewFeedbackBarIds = {
  SELECT_FEEDBACK_BTN_BY_FEEDBACK: (feedback: Feedback): string =>
    'SELECT_FEEDBACK_BTN_BY_FEEDBACK_' + feedback,
};
