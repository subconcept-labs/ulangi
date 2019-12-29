/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const QuizSettingsScreenIds = {
  SCREEN: 'QUIZ_SETTINGS_SCREEN',
  TOP_BAR: 'QUIZ_SETTINGS_TOP_BAR',
  BACK_BTN: 'BACK_BTN',
  SAVE_BTN: 'SAVE_BTN',
  VOCABULARY_POOL_BTN: 'VOCABULARY_POOL_BTN',
  WRITING_QUIZ_LIMIT_BTN: 'WRITING_QUIZ_LIMIT_BTN',
  MULTIPLE_CHOICE_QUIZ_LIMIT_BTN: 'MULTIPLE_CHOICE_QUIZ_LIMIT_BTN',
  SELECT_WRITING_QUIZ_LIMIT_BTN_BY_LIMIT: (limit: number): string =>
    'SELECT_WRITING_QUIZ_BTN_BY_LIMIT' + limit,
  SELECT_MULTIPLE_CHOICE_QUIZ_LIMIT_BTN_BY_LIMIT: (limit: number): string =>
    'SELECT_MULTIPLE_CHOICE_QUIZ_BTN_BY_LIMIT' + limit,
  SELECT_VOCABULARY_POOL_BTN_BY_VOCABULARY_POOL_NAME: (
    vocabularyPoolName: string,
  ): string =>
    'SELECT_VOCABULARY_POOL_BTN_BY_VOCABULARY_POOL_NAME_' + vocabularyPoolName,
};
