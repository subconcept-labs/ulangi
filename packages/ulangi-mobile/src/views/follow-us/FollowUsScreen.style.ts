/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface FollowUsScreenStyles {
  screen: ViewStyle;
  intro_container: ViewStyle;
  intro_text: TextStyle;
  section_container: ViewStyle;
}

export class FollowUsScreenResponsiveStyles extends ResponsiveStyleSheet<
  FollowUsScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): FollowUsScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      intro_container: {
        paddingHorizontal: scaleByFactor(16),
      },

      intro_text: {
        fontSize: scaleByFactor(15),
      },

      section_container: {
        marginTop: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<FollowUsScreenStyles> {
    return {
      intro_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<FollowUsScreenStyles> {
    return {
      intro_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const followUsScreenResponsiveStyles = new FollowUsScreenResponsiveStyles();
