/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */
import { ReviewPriority } from '@ulangi/ulangi-common/enums';

export const WritingSettingsScreenIds = {
  SCREEN: 'WRITING_SETTINGS_SCREEN',
  TOP_BAR: 'WRITING_SETTINGS_TOP_BAR',
  LIMIT_BTN: 'LIMITL_BTN',
  INITIAL_INTERVAL_BTN: 'INTERVAL_INTERVAL_BTN',
  FEEDBACK_BUTTONS_BTN: 'FEEDBACK_BUTTONSL_BTN',
  AUTOPLAY_AUDIO_BTN: 'AUTOPLAY_AUDIO_BTN',
  AUTO_SHOW_KEYBOARD_BTN: 'AUTO_SHOW_KEYBOARD_BTN',
  HIGHLIGHT_ON_ERROR_BTN: 'HIGHLIGHT_ON_ERROR_BTN',
  REVIEW_PRIORITY_BTN: 'REVIEW_PRIORITY_BTN',
  SELECT_LIMIT_BTN_BY_LIMIT: (limit: number): string =>
    'SELECT_LIMIT_BTN_BY_LIMIT_' + limit,
  SELECT_FEEDBACK_BUTTONS_BTN_BY_FEEDBACK_BUTTONS: (
    feedbackButtons: 3 | 4 | 5,
  ): string =>
    'SELECT_FEEDBACK_BUTTONS_BTN_BY_FEEDBACK_BUTTONS_' + feedbackButtons,
  SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL: (
    initialInterval: number,
  ): string =>
    'SELECT_INITIAL_INTERVAL_BTN_BY_INITIAL_INTERVAL_' + initialInterval,
  SELECT_AUTOPLAY_AUDIO_BTN_BY_AUTOPLAY_AUDIO: (
    autoplayAudio: boolean,
  ): string => 'SELECT_AUTOPLAY_AUDIO_BTN_BY_AUTOPLAY_AUDIO_' + autoplayAudio,
  SELECT_AUTO_SHOW_KEYBOARD_BTN: (autoShowKeyboard: boolean): string =>
    'SELECT_AUTO_SHOW_KEYBOARD_BTN_' + autoShowKeyboard,
  SELECT_REVIEW_PRIORITY_BTN_BY_REVIEW_PRIORITY: (
    reviewPriority: ReviewPriority,
  ): string =>
    'SELECT_REVIEW_PRIORITY_BTN_BY_REVIEW_PRIORITY_' + reviewPriority,
  BACK_BTN: 'BACK_BTN',
  SAVE_BTN: 'SAVE_BTN',
};
