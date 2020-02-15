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
  MULTIPLE_CHOICE_QUIZ_SIZE_BTN: 'MULTIPLE_CHOICE_QUIZ_SIZE_BTN',
  WRITING_QUIZ_SIZE_BTN: 'WRITING_QUIZ_SIZE_BTN',
  WRITING_AUTO_SHOW_KEYBOARD_BTN: 'WRITING_AUTO_SHOW_KEYBOARD_BTN',
  SELECT_MULTIPLE_CHOICE_QUIZ_SIZE_BTN: (size: number): string =>
    'SELECT_MULTIPLE_CHOICE_QUIZ_SIZE_BTN_' + size,
  SELECT_WRITING_QUIZ_SIZE_BTN: (size: number): string =>
    'SELECT_WRITING_QUIZ_SIZE_BTN_' + size,
  SELECT_WRITING_AUTO_SHOW_KEYBOARD_BTN: (autoShowKeyboard: boolean): string =>
    'SELECT_WRITING_AUTO_SHOW_KEYBOARD_BTN_' + autoShowKeyboard,
  SELECT_VOCABULARY_POOL_BTN: (vocabularyPoolName: string): string =>
    'SELECT_VOCABULARY_POOL_BTN_' + vocabularyPoolName,
};
