/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SearchListStyles {
  no_results_container: ViewStyle;
  no_results_text: TextStyle;
  tip_container: ViewStyle;
  tip: TextStyle;
  center_activity_indicator: ViewStyle;
  bottom_activity_indicator: ViewStyle;
  list_container: ViewStyle;
  list: ViewStyle;
}

export class SearchListResponsiveStyles extends ResponsiveStyleSheet<
  SearchListStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SearchListStyles {
    return {
      no_results_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        marginTop: -scaleByFactor(100),
      },

      no_results_text: {
        fontSize: scaleByFactor(15),
        color: '#999',
        paddingHorizontal: scaleByFactor(16),
        textAlign: 'center',
      },

      tip_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        marginTop: -scaleByFactor(100),
      },

      tip: {
        fontSize: scaleByFactor(15),
        color: '#999',
        paddingHorizontal: scaleByFactor(16),
        textAlign: 'center',
        lineHeight: scaleByFactor(19),
      },

      center_activity_indicator: {
        marginVertical: scaleByFactor(8),
      },

      bottom_activity_indicator: {
        marginTop: scaleByFactor(16),
      },

      list_container: {
        flex: 1,
      },

      list: {
        paddingTop: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<SearchListStyles> {
    return {};
  }

  public darkStyles(): Partial<SearchListStyles> {
    return {};
  }
}

export const searchListResponsiveStyles = new SearchListResponsiveStyles();
