/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SectionRowStyles {
  outer_container: ViewStyle;
  inner_container: ViewStyle;
  row_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  left_text: TextStyle;
  right_text: TextStyle;
  caret: ImageStyle;
  description_container: ViewStyle;
  description_text: TextStyle;
  disabled_container: ViewStyle;
  disabled_left_text: TextStyle;
}

export class SectionRowResponsiveStyles extends ResponsiveStyleSheet<
  SectionRowStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SectionRowStyles {
    return {
      outer_container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      inner_container: {
        paddingVertical: scaleByFactor(3),
      },

      row_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(10),
      },

      left: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: scaleByFactor(8),
      },

      right: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      left_text: {
        fontSize: scaleByFactor(15),
      },

      right_text: {
        fontSize: scaleByFactor(15),
      },

      caret: {
        marginLeft: scaleByFactor(8),
      },

      description_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingTop: scaleByFactor(6),
        paddingBottom: scaleByFactor(12),
      },

      description_text: {
        fontSize: scaleByFactor(15),
        lineHeight: scaleByFactor(19),
      },

      disabled_container: {},

      disabled_left_text: {},
    };
  }

  public lightStyles(): Partial<SectionRowStyles> {
    return {
      outer_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      left_text: {
        color: config.styles.light.primaryTextColor,
      },

      right_text: {
        color: config.styles.light.secondaryTextColor,
      },

      description_text: {
        color: config.styles.light.secondaryTextColor,
      },

      disabled_container: {
        backgroundColor: '#ddd',
      },

      disabled_left_text: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SectionRowStyles> {
    return {
      outer_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      left_text: {
        color: config.styles.dark.primaryTextColor,
      },

      right_text: {
        color: config.styles.dark.secondaryTextColor,
      },

      description_text: {
        color: config.styles.dark.secondaryTextColor,
      },

      disabled_container: {
        backgroundColor: '#363636',
      },

      disabled_left_text: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const sectionRowResponsiveStyles = new SectionRowResponsiveStyles();
