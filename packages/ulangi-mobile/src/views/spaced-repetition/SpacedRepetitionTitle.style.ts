/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SpacedRepetitionTitleStyles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  icon: ImageStyle;
}

export class SpacedRepetitionTitleResponsiveStyles extends ResponsiveStyleSheet<
  SpacedRepetitionTitleStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SpacedRepetitionTitleStyles {
    return {
      container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      title: {
        fontSize: scaleByFactor(26),
        fontFamily: 'JosefinSans-Bold',
        letterSpacing: -scaleByFactor(0.5),
      },

      subtitle: {
        paddingTop: scaleByFactor(4),
        fontSize: scaleByFactor(9),
        fontFamily: 'JosefinSans-Bold',
        letterSpacing: scaleByFactor(0.5),
      },

      icon: {
        marginTop: scaleByFactor(10),
      },
    };
  }

  public lightStyles(): Partial<SpacedRepetitionTitleStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },

      subtitle: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SpacedRepetitionTitleStyles> {
    return {
      title: {
        color: config.styles.dark.primaryTextColor,
      },

      subtitle: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const spacedRepetitionTitleResponsiveStyles = new SpacedRepetitionTitleResponsiveStyles();
