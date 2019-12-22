/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const CategoryItemIds = {
  VIEW_DETAIL_BTN_BY_CATEGORY_NAME: (categoryName: string): string =>
    'VIEW_DETAIL_BTN_BY_CATEGORY_NAME_' + categoryName,
  SHOW_ACTION_MENU_BTN_BY_CATEGORY_NAME: (categoryName: string): string =>
    'SHOW_ACTION_MENU_BTN_BY_CATEGORY_NAME_' + categoryName,
  SELECT_BTN_BY_CATEGORY_NAME: (categoryName: string): string =>
    'SELECT_BTN_BY_CATEGORY_NAME_' + categoryName,
  UNSELECT_BTN_BY_CATEGORY_NAME: (categoryName: string): string =>
    'UNSELECT_BTN_BY_CATEGORY_NAME_' + categoryName,
};
