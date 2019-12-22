/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const WritingSettingsScreenIds = {
  SCREEN: 'WRITING_SETTINGS_SCREEN',
  TOP_BAR: 'WRITING_SETTINGS_TOP_BAR',
  LIMIT_BTN: 'LIMITL_BTN',
  INITIAL_INTERVAL_BTN: 'INTERVAL_INTERVAL_BTN',
  SELECT_LIMIT_BTN_BY_LIMIT: (limit: number): string =>
    'SELECT_LIMIT_BTN_BY_LIMIT_' + limit,
  SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL: (
    initialInterval: number
  ): string =>
    'SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL_' + initialInterval,
  USE_HINT_SIDE_EFFECT_BTN: 'USE_HINT_SIDE_EFFECT_BTN',
  BACK_BTN: 'BACK_BTN',
  SAVE_BTN: 'SAVE_BTN',
};
