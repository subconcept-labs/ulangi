/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SearchFloatingButtonStyles {
  button: ViewStyle;
}

export class SearchFloatingButtonResponsiveStyles extends ResponsiveStyleSheet<
  SearchFloatingButtonStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SearchFloatingButtonStyles {
    return {
      button: {
        width: scaleByFactor(50),
        height: scaleByFactor(50),
        borderRadius: scaleByFactor(50) / 2,
        backgroundColor: config.styles.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 1,
        shadowOpacity: 0.2,
        elevation: 1,
      },
    };
  }

  public lightStyles(): Partial<SearchFloatingButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<SearchFloatingButtonStyles> {
    return {};
  }
}

export const searchFloatingButtonResponsiveStyles = new SearchFloatingButtonResponsiveStyles();
