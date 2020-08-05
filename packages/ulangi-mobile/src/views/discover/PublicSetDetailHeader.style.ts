/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface PublicSetDetailHeaderStyles {
  container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  attributions: TextStyle;
  attribution: TextStyle;
  term_count: TextStyle;
  add_all_btn: ViewStyle;
  add_all_plus: ImageStyle;
  add_all_text: TextStyle;
  highlighted: TextStyle;
}

export class PublicSetDetailHeaderResponsiveStyles extends ResponsiveStyleSheet<
  PublicSetDetailHeaderStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): PublicSetDetailHeaderStyles {
    return {
      container: {
        paddingVertical: scaleByFactor(16),
        paddingHorizontal: scaleByFactor(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
      },

      left: {},

      right: {},

      attributions: {
        fontSize: scaleByFactor(13),
      },

      attribution: {
        color: config.styles.primaryColor,
        textAlign: 'center',
      },

      term_count: {
        fontSize: scaleByFactor(14),
        fontWeight: 'bold',
      },

      add_all_btn: {
        borderRadius: scaleByFactor(3),
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: scaleByFactor(8),
        paddingVertical: scaleByFactor(6),
        marginLeft: scaleByFactor(7),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.75,
        shadowOpacity: 0.15,
        elevation: 0.75,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      add_all_plus: {
        marginRight: scaleByFactor(3),
      },

      add_all_text: {
        fontSize: scaleByFactor(13),
        fontWeight: 'bold',
      },

      highlighted: {
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<PublicSetDetailHeaderStyles> {
    return {
      container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      attributions: {
        color: config.styles.light.secondaryTextColor,
      },

      term_count: {
        color: config.styles.light.secondaryTextColor,
      },

      add_all_btn: {
        borderColor: config.styles.light.primaryBorderColor,
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      add_all_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<PublicSetDetailHeaderStyles> {
    return {
      container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      attributions: {
        color: config.styles.dark.secondaryTextColor,
      },

      term_count: {
        color: config.styles.dark.secondaryTextColor,
      },

      add_all_btn: {
        borderColor: config.styles.dark.primaryBorderColor,
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      add_all_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const publicSetDetailHeaderResponsiveStyles = new PublicSetDetailHeaderResponsiveStyles();
