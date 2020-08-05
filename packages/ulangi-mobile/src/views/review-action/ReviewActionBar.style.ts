/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReviewActionBarStyles {
  container: ViewStyle;
  action_btn: ViewStyle;
  icon_container: ViewStyle;
  title_container: ViewStyle;
  action_title: TextStyle;
  action_subtitle: TextStyle;
}

export class ReviewActionBarResponsiveStyles extends ResponsiveStyleSheet<
  ReviewActionBarStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReviewActionBarStyles {
    return {
      container: {},

      action_btn: {
        flexDirection: 'row',
        paddingHorizontal: scaleByFactor(16),
        maxWidth: scaleByFactor(150),
        alignItems: 'center',
        paddingVertical: scaleByFactor(12),
        overflow: 'hidden',
      },

      icon_container: {
        width: scaleByFactor(25),
        height: scaleByFactor(25),
        justifyContent: 'center',
        alignItems: 'center',
      },

      title_container: {
        flexShrink: 1,
        marginLeft: scaleByFactor(6),
        alignSelf: 'stretch',
        justifyContent: 'center',
      },

      action_title: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(11),
        letterSpacing: scaleByFactor(-0.5),
      },

      action_subtitle: {
        letterSpacing: scaleByFactor(-0.5),
        fontSize: scaleByFactor(11),
      },
    };
  }

  public lightStyles(): Partial<ReviewActionBarStyles> {
    return {
      action_title: {
        color: config.styles.light.primaryTextColor,
      },

      action_subtitle: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<ReviewActionBarStyles> {
    return {
      action_title: {
        color: config.styles.dark.primaryTextColor,
      },

      action_subtitle: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const reviewActionBarResponsiveStyles = new ReviewActionBarResponsiveStyles();
