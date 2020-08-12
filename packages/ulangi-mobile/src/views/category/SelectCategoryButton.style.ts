/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface SelectCategoryButtonStyles {
  container: ViewStyle;
}

export class SelectCategoryButtonResponsiveStyles extends ResponsiveStyleSheet<
  SelectCategoryButtonStyles
> {
  public baseStyles(): SelectCategoryButtonStyles {
    return {
      container: {
        alignItems: 'center',
      },
    };
  }

  public lightStyles(): Partial<SelectCategoryButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<SelectCategoryButtonStyles> {
    return {};
  }
}

export const selectCategoryButtonResponsiveStyles = new SelectCategoryButtonResponsiveStyles();
