/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReviewFeedbackBarStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  feedback_container: ViewStyle;
  feedback_btn: ViewStyle;
  feedback_text: TextStyle;
  time_text: TextStyle;
  level_text: TextStyle;
}

export class ReviewFeedbackBarResponsiveStyles extends ResponsiveStyleSheet<
  ReviewFeedbackBarStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReviewFeedbackBarStyles {
    return {
      container: {},

      title_container: {
        paddingVertical: scaleByFactor(10),
      },

      title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: scaleByFactor(15),
      },

      subtitle: {
        textAlign: 'center',
        fontSize: scaleByFactor(14),
      },

      feedback_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scaleByFactor(3),
        paddingBottom: scaleByFactor(14),
      },

      feedback_btn: {
        flex: 1,
        borderRadius: scaleByFactor(6),
        marginHorizontal: scaleByFactor(3),
        paddingVertical: scaleByFactor(7),
      },

      feedback_text: {
        fontWeight: '700',
        textAlign: 'center',
        fontSize: scaleByFactor(11),
        letterSpacing: -1,
        color: '#f7f7f7',
      },

      time_text: {
        textAlign: 'center',
        fontSize: scaleByFactor(13),
        fontWeight: '700',
        color: '#f7f7f7',
      },

      level_text: {
        textAlign: 'center',
        fontSize: scaleByFactor(13),
        color: '#fff',
      },
    };
  }

  public lightStyles(): Partial<ReviewFeedbackBarStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },

      subtitle: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<ReviewFeedbackBarStyles> {
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

export const reviewFeedbackBarResponsiveStyles = new ReviewFeedbackBarResponsiveStyles();
