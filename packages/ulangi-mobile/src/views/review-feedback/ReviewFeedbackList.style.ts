/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReviewFeedbackListStyles {
  header: ViewStyle;
  header_text: TextStyle;
  list_content_container: ViewStyle;
  bold: TextStyle;
}

export class ReviewFeedbackListResponsiveStyles extends ResponsiveStyleSheet<
  ReviewFeedbackListStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReviewFeedbackListStyles {
    return {
      header: {
        paddingHorizontal: scaleByFactor(16),
        paddingTop: scaleByFactor(16),
      },

      header_text: {
        fontSize: scaleByFactor(14),
        textAlign: 'center',
      },

      list_content_container: {
        paddingBottom: scaleByFactor(16),
      },

      bold: {
        fontWeight: '700',
      },
    };
  }

  public lightStyles(): Partial<ReviewFeedbackListStyles> {
    return {
      header_text: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<ReviewFeedbackListStyles> {
    return {
      header_text: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const reviewFeedbackListResponsiveStyles = new ReviewFeedbackListResponsiveStyles();
