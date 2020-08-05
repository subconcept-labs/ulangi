/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DiscoverSearchStyles {
  search_container: ViewStyle;

  search_icon: ImageStyle;

  remove_icon: ImageStyle;

  search_input: TextStyle;
}

export class DiscoverSearchResponsiveStyles extends ResponsiveStyleSheet<
  DiscoverSearchStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): DiscoverSearchStyles {
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

      remove_icon: {
        marginLeft: scaleByFactor(3),
      },

      search_input: {
        flex: 1,
        fontSize: scaleByFactor(15),
        padding: scaleByFactor(0),
        height: scaleByFactor(40),
      },
    };
  }

  public lightStyles(): Partial<DiscoverSearchStyles> {
    return {
      search_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.3 },
        shadowRadius: 0.75,
        shadowOpacity: 0.25,
        elevation: 0.75,
      },

      search_input: {
        color: '#545454',
      },
    };
  }

  public darkStyles(): Partial<DiscoverSearchStyles> {
    return {
      search_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.75,
        shadowOpacity: 0.25,
        elevation: 3,
      },

      search_input: {
        color: '#ddd',
      },
    };
  }
}

export const discoverSearchResponsiveStyles = new DiscoverSearchResponsiveStyles();
