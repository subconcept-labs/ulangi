/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LightBoxContainerWithTitleStyles {
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
}

export class LightBoxContainerWithTitleResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxContainerWithTitleStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): LightBoxContainerWithTitleStyles {
    return {
      light_box_container: {
        justifyContent: 'center',
        paddingVertical: 150,
      },

      inner_container: {
        flexShrink: 1,
        borderRadius: scaleByFactor(4),
        marginHorizontal: scaleByFactor(16),
        overflow: 'hidden',
      },

      title_container: {
        alignSelf: 'stretch',
        paddingVertical: scaleByFactor(12),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      title: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<LightBoxContainerWithTitleStyles> {
    return {
      inner_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      title_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      title: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<LightBoxContainerWithTitleStyles> {
    return {
      inner_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      title_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      title: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const lightBoxContainerWithTitleResponsiveStyles = new LightBoxContainerWithTitleResponsiveStyles();
