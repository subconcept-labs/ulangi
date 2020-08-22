/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface QuickTutorialScreenStyles {
  screen: ViewStyle;
  carousel: ViewStyle;
  pagination: ViewStyle;
  button_container: ViewStyle;
  image_container: ViewStyle;
  image: ImageStyle;
  note: TextStyle;
}

export class QuickTutorialScreenResponsiveStyles extends ResponsiveStyleSheet<
  QuickTutorialScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): QuickTutorialScreenStyles {
    return {
      screen: {
        flex: 1,
        alignItems: 'center',
      },

      carousel: {
        alignItems: 'center',
      },

      pagination: {
        height: scaleByFactor(50),
        paddingVertical: 0,
      },

      image_container: {
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scaleByFactor(16),
      },

      image: {
        flexShrink: 1,
      },

      button_container: {
        paddingVertical: scaleByFactor(12),
        justifyContent: 'center',
        alignItems: 'center',
      },

      note: {
        paddingVertical: scaleByFactor(8),
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        fontSize: scaleByFactor(13),
        textAlign: 'center',
      },
    };
  }

  public lightStyles(): Partial<QuickTutorialScreenStyles> {
    return {
      note: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<QuickTutorialScreenStyles> {
    return {
      note: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const quickTutorialScreenResponsiveStyles = new QuickTutorialScreenResponsiveStyles();
