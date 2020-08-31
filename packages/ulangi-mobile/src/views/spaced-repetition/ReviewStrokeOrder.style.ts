/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface ReviewStrokeOrderStyles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  button_text: TextStyle;
}

export class ReviewStrokeOrderResponsiveStyles extends ResponsiveStyleSheet<
  ReviewStrokeOrderStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): ReviewStrokeOrderStyles {
    return {
      container: {
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        marginTop: scaleByFactor(10),
      },

      title: {
        fontSize: scaleByFactor(15),
        fontWeight: 'bold',
      },

      subtitle: {
        fontSize: scaleByFactor(15),
      },

      button_text: {
        fontSize: scaleByFactor(15),
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<ReviewStrokeOrderStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },

      subtitle: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<ReviewStrokeOrderStyles> {
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

export const reviewStrokeOrderResponsiveStyles = new ReviewStrokeOrderResponsiveStyles();
