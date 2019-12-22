/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export const CategoryFormIds = {
  CATEGORY_INPUT: 'CATEGORY_INPUT',
  SHOW_ALL_BTN: 'SHOW_ALL_BTN',
  USE_BTN_BY_CATEGORY_NAME: (categoryName: string): string =>
    'USE_BTN_BY_CATEGORY_NAME_' + categoryName,
};
