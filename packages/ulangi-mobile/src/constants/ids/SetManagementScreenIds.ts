/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const SetManagementScreenIds = {
  SCREEN: 'SET_MANAGEMENT_SCREEN',
  TOP_BAR: 'SET_MANAGEMENT_TOP_BAR',
  ADD_BTN: 'ADD_BTN',
  BACK_BTN: 'BACK_BTN',
  SET_LIST: 'SET_LIST',
  SELECT_TAB_BTN_BY_SET_STATUS: (setStatus: string): string =>
    'SELECT_TAB_BTN_BY_SET_STATUS_' + setStatus,
};
