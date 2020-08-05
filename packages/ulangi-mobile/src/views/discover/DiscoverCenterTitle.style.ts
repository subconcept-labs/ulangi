/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DiscoverCenterTitleStyles {
  container: ViewStyle;
  title: TextStyle;
  highlighted: TextStyle;
  search_button: ViewStyle;
}

export class DiscoverCenterTitleResponsiveStyles extends ResponsiveStyleSheet<
  DiscoverCenterTitleStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): DiscoverCenterTitleStyles {
    return {
      container: {
        flex: 1,
        paddingHorizontal: scaleByFactor(26),
        justifyContent: 'center',
        alignItems: 'center',
      },

      title: {
        textAlign: 'center',
        color: '#999',
        fontSize: scaleByFactor(16),
      },

      highlighted: {
        color: config.styles.primaryColor,
        fontSize: scaleByFactor(16),
        fontWeight: '700',
      },

      search_button: {
        marginTop: scaleByFactor(16),
        width: scaleByFactor(50),
        height: scaleByFactor(50),
        borderRadius: scaleByFactor(50) / 2,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 0.75,
        shadowOpacity: 0.15,
        elevation: 0.75,
      },
    };
  }

  public lightStyles(): Partial<DiscoverCenterTitleStyles> {
    return {};
  }

  public darkStyles(): Partial<DiscoverCenterTitleStyles> {
    return {};
  }
}

export const discoverCenterTitleResponsiveStyles = new DiscoverCenterTitleResponsiveStyles();
