/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';

export class BottomTabsStyle {
  public static getBackgroundColor(theme: Theme): string {
    return theme === Theme.LIGHT ? '#f7f7f7' : '#212121';
  }
}
