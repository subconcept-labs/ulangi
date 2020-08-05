/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface SearchBarStyles {
  container: ViewStyle;
}

export class SearchBarResponsiveStyles extends ResponsiveStyleSheet<
  SearchBarStyles
> {
  public baseStyles(): SearchBarStyles {
    return {
      container: {
        borderBottomWidth: 1,
      },
    };
  }

  public lightStyles(): Partial<SearchBarStyles> {
    return {
      container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<SearchBarStyles> {
    return {
      container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const searchBarResponsiveStyles = new SearchBarResponsiveStyles();
