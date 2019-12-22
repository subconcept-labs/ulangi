/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const PublicVocabularyItemIds = {
  PUBLIC_VOCABULARY_CONTAINER_BY_VOCABULARY_TEXT: (
    vocabularyText: string
  ): string =>
    'PUBLIC_VOCABULARY_CONTAINER_BY_VOCABULARY_TEXT_' + vocabularyText,

  ADD_VOCABULARY_BTN_BY_VOCABULARY_TEXT: (vocabularyText: string): string =>
    'ADD_VOCABULARY_BTN_BY_VOCABULARY_TEXT_' + vocabularyText,

  SHOW_PUBLIC_VOCABULARY_ACTION_MENU_BTN_BY_VOCABULARY_TEXT: (
    vocabularyText: string
  ): string =>
    'SHOW_PUBLIC_VOCABULARY_ACTION_MENU_BTN_BY_VOCABULARY_TEXT_' +
    vocabularyText,
};
