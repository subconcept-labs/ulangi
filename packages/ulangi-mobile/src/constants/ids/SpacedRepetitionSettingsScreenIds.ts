/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */
import { ReviewPriority, ReviewStrategy } from '@ulangi/ulangi-common/enums';

export const SpacedRepetitionSettingsScreenIds = {
  SCREEN: 'SPACED_REPETITION_SETTINGS_SCREEN',
  TOP_BAR: 'SPACED_REPETITION_SETTINGS_TOP_BAR',
  REVIEW_STRATEGY_BTN: 'REVIEW_STRATEGY_BTN',
  REVIEW_PRIORITY_BTN: 'REVIEW_PRIORITY_BTN',
  LIMIT_BTN: 'LIMIT_BTN',
  FEEDBACK_BUTTONS_BTN: 'FEEDBACK_BUTTONS_BTN',
  INITIAL_INTERVAL_BTN: 'INITIAL_INTERVAL_BTN',
  AUTOPLAY_AUDIO_BTN: 'AUTOPLAY_AUDIO_BTN',
  SELECT_REVIEW_STRATEGY_BTN_BY_REVIEW_STRATEGY: (
    reviewStrategy: ReviewStrategy,
  ): string =>
    'SELECT_REVIEW_STRATEGY_BTN_BY_REVIEW_STRATEGY_' + reviewStrategy,
  SELECT_REVIEW_PRIORITY_BTN_BY_REVIEW_PRIORITY: (
    reviewPriority: ReviewPriority,
  ): string =>
    'SELECT_REVIEW_PRIORITY_BTN_BY_REVIEW_PRIORITY_' + reviewPriority,
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
  BACK_BTN: 'BACK_BTN',
  SAVE_BTN: 'SAVE_BTN',
};
