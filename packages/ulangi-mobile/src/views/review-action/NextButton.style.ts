/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface NextButtonStyles {
  container: ViewStyle;
  next_button_container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
}

export class NextButtonResponsiveStyles extends ResponsiveStyleSheet<
  NextButtonStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): NextButtonStyles {
    return {
      container: {},

      next_button_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
      },

      title_container: {
        paddingVertical: scaleByFactor(10),
      },

      title: {
        textAlign: 'center',
        fontSize: scaleByFactor(14),
      },

      subtitle: {
        textAlign: 'center',
        fontSize: scaleByFactor(14),
      },
    };
  }

  public lightStyles(): Partial<NextButtonStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },

      subtitle: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<NextButtonStyles> {
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

export const nextButtonResponsiveStyles = new NextButtonResponsiveStyles();
