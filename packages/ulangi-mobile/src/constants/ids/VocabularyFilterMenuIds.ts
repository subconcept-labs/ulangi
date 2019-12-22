/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';

export const VocabularyFilterMenuIds = {
  FILTER_MENU: 'VOCABULARY_FILTER_MENU',
  FILTER_BTN_BY_FILTER_TYPE: (filterType: VocabularyFilterType): string =>
    'FILTER_BTN_BY_FILTER_TYPE_' + filterType,
};
