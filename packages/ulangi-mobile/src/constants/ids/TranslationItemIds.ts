/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const TranslationItemIds = {
  TRANSLATION_CONTAINER_BY_VOCABULARY_TEXT: (vocabularyText: string): string =>
    'TRANSLATION_CONTAINER_BY_VOCABULARY_TEXT_' + vocabularyText,
  ADD_VOCABULARY_FROM_TRANSLATION_BTN_BY_VOCABULARY_TEXT: (
    vocabularyText: string
  ): string =>
    'ADD_VOCABULARY_FROM_TRANSLATION_BTN_BY_VOCABULARY_TEXT_' + vocabularyText,
  SHOW_TRANSLATION_ACTION_MENU_BTN_BY_VOCABULARY_TEXT: (
    vocabularyText: string
  ): string =>
    'SHOW_TRANSLATION_ACTION_MENU_BTN_BY_VOCABULARY_TEXT_' + vocabularyText,
};
