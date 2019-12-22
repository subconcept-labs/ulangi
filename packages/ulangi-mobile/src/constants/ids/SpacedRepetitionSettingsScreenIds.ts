/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const SpacedRepetitionSettingsScreenIds = {
  SCREEN: 'SPACED_REPETITION_SETTINGS_SCREEN',
  TOP_BAR: 'SPACED_REPETITION_SETTINGS_TOP_BAR',
  LIMIT_BTN: 'LIMIT_BTN',
  INITIAL_INTERVAL_BTN: 'INITIAL_INTERVAL_BTN',
  SELECT_LIMIT_BTN_BY_LIMIT: (limit: number): string =>
    'SELECT_LIMIT_BTN_BY_LIMIT' + limit,
  SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL: (
    initialInterval: number
  ): string =>
    'SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL_' + initialInterval,
  SHOW_DEFINITIONS_SIDE_EFFECT_BTN: 'SHOW_DEFINITIONS_SIDE_EFFECT_BTN',
  BACK_BTN: 'BACK_BTN',
  SAVE_BTN: 'SAVE_BTN',
};
