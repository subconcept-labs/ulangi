/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const VocabularyItemIds = {
  VOCABULARY_EXTRA_FIELD_BY_NAME_VALUE: (name: string, value: string): string =>
    'VOCABULARY_EXTRA_FIELD_BY_NAME_VALUE_' + name + '_' + value,
  SELECT_BTN_BY_VOCABULARY_TERM: (vocabularyTerm: string): string =>
    'SELECT_BTN_BY_VOCABULARY_TERM_' + vocabularyTerm,
  UNSELECT_BTN_BY_VOCABULARY_TERM: (vocabularyTerm: string): string =>
    'UNSELECT_BTN_BY_VOCABULARY_TERM_' + vocabularyTerm,
  VIEW_DETAIL_BTN_BY_VOCABULARY_TERM: (vocabularyTerm: string): string =>
    'VIEW_DETAIL_BTN_BY_VOCABULARY_TERM_' + vocabularyTerm,
  SHOW_ACTION_MENU_BTN_BY_VOCABULARY_TERM: (vocabularyTerm: string): string =>
    'SHOW_ACTION_MENU_BTN_BY_VOCABULARY_TERM_' + vocabularyTerm,
  DEFINITION_BY_INDEX: (index: number): string =>
    'DEFINITION_BY_INDEX_' + index.toString(),
  DEFINITION_EXTRA_FIELD_BY_NAME_VALUE: (name: string, value: string): string =>
    'DEFINITION_EXTRA_FIELD_BY_INDEX_AND_NAME_VALUE_' + name + '_' + value,
  WORD_CLASS_BY_VALUE: (value: string): string =>
    'WORD_CLASS_BY_VALUE_' + value,
};
