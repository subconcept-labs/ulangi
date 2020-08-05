/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LightBoxTitleStyles {
  title_container: ViewStyle;
  title_text: TextStyle;
}

export class LightBoxTitleResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxTitleStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LightBoxTitleStyles {
    return {
      title_container: {
        alignSelf: 'stretch',
        paddingVertical: scaleByFactor(12),
        paddingHorizontal: scaleByFactor(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center',
      },

      title_text: {
        fontSize: scaleByFactor(13),
        fontWeight: 'bold',
        letterSpacing: -0.25,
      },
    };
  }

  public lightStyles(): Partial<LightBoxTitleStyles> {
    return {
      title_container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      title_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<LightBoxTitleStyles> {
    return {
      title_container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      title_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const lightBoxTitleResponsiveStyles = new LightBoxTitleResponsiveStyles();
