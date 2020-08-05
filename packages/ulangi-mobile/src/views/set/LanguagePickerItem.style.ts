/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LanguagePickerItemStyles {
  item_container: ViewStyle;
  touchable: ViewStyle;
  select_icon: ImageStyle;
  flag_icon: ImageStyle;
  text_container: ViewStyle;
  item_text: TextStyle;
  item_note: TextStyle;
}

export class LanguagePickerItemResponsiveStyles extends ResponsiveStyleSheet<
  LanguagePickerItemStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LanguagePickerItemStyles {
    return {
      item_container: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: -1,
        marginHorizontal: scaleByFactor(8),
      },

      touchable: {
        paddingVertical: scaleByFactor(15),
        paddingHorizontal: scaleByFactor(8),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },

      select_icon: {
        marginRight: scaleByFactor(10),
      },

      flag_icon: {
        marginRight: scaleByFactor(6),
      },

      text_container: {
        flexShrink: 1,
      },

      item_text: {
        fontSize: scaleByFactor(15),
      },

      item_note: {
        fontSize: scaleByFactor(13),
        color: 'orange',
      },
    };
  }

  public lightStyles(): Partial<LanguagePickerItemStyles> {
    return {
      item_container: {
        borderTopColor: config.styles.light.secondaryBorderColor,
        borderBottomColor: config.styles.light.secondaryBorderColor,
      },

      item_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<LanguagePickerItemStyles> {
    return {
      item_container: {
        borderTopColor: config.styles.dark.secondaryBorderColor,
        borderBottomColor: config.styles.dark.secondaryBorderColor,
      },

      item_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const languagePickerItemResponsiveStyles = new LanguagePickerItemResponsiveStyles();
