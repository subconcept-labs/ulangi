/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LightBoxActionMenuStyles {
  action_menu_container: ViewStyle;
  title_container: ViewStyle;
  title_text: TextStyle;
  list_container: ViewStyle;
}

export class LightBoxActionMenuResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxActionMenuStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LightBoxActionMenuStyles {
    return {
      action_menu_container: {
        flexShrink: 1,
        marginVertical: scaleByFactor(16),
        borderRadius: scaleByFactor(4),
      },

      title_container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        height: scaleByFactor(50),
      },

      title_text: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(16),
      },

      list_container: {},
    };
  }

  public lightStyles(): Partial<LightBoxActionMenuStyles> {
    return {
      action_menu_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      title_container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      title_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<LightBoxActionMenuStyles> {
    return {
      action_menu_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      title_container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      title_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const lightBoxActionMenuResponsiveStyles = new LightBoxActionMenuResponsiveStyles();
