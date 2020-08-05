/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SearchInputStyles {
  search_container: ViewStyle;
  search_icon: ImageStyle;
  text_input: TextStyle;
}

export class SearchInputResponsiveStyles extends ResponsiveStyleSheet<
  SearchInputStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SearchInputStyles {
    return {
      search_container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: scaleByFactor(16),
        marginVertical: scaleByFactor(12),
        paddingHorizontal: scaleByFactor(13),
        borderRadius: scaleByFactor(5),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.3 },
        shadowRadius: 0.75,
        shadowOpacity: 0.25,
        elevation: 0.75,
      },

      search_icon: {
        marginRight: scaleByFactor(3),
      },

      text_input: {
        flex: 1,
        fontSize: scaleByFactor(15),
        paddingVertical: scaleByFactor(10),
      },
    };
  }

  public lightStyles(): Partial<SearchInputStyles> {
    return {
      search_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      text_input: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SearchInputStyles> {
    return {
      search_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      text_input: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const searchInputResponsiveStyles = new SearchInputResponsiveStyles();
