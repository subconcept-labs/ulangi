/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const ReviewFeedbackItemIds = {
  SHOW_FEEDBACK_SELECTION_MENU_BTN_BY_VOCABULARY_TEXT: (
    vocabularyText: string,
  ): string =>
    'SHOW_FEEDBACK_SELECTION_MENU_BTN_BY_VOCABULARY_TEXT_' + vocabularyText,

  NEXT_LEVEL_BY_VOCABULARY_TEXT: (vocabularyText: string): string =>
    'NEXT_LEVEL_BY_VOCABULARY_TEXT_' + vocabularyText,

  NEXT_REVIEW_BY_VOCABULARY_TEXT: (vocabularyText: string): string =>
    'NEXT_REVIEW_BY_VOCABULARY_TEXT_' + vocabularyText,
};
