/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const ReviewActionBarIds = {
  PREVIOUS_BTN: 'PREVIOUS_BTN',
  NEXT_BTN: 'NEXT_BTN',
  SHOW_ANSWER_BTN: 'SHOW_ANSWER_BTN',
  PLAY_AUDIO_BTN_BY_VALUE: (value: string): string =>
    'PLAY_AUDIO_BTN_BY_VALUE_' + value,
  EDIT_BTN: 'EDIT_BTN',
  DISABLE_BTN: 'DISABLE_BTN',
};
