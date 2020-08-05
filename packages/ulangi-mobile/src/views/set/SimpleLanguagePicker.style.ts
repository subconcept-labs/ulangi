/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../../utils/responsive';

export interface SimpleLanguagePickerStyles {
  content_container: ViewStyle;
  item_touchable: ViewStyle;
  flag_icon: ImageStyle;
  item_text: TextStyle;
}

export class SimpleLanguagePickerResponsiveStyles extends ResponsiveStyleSheet<
  SimpleLanguagePickerStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): SimpleLanguagePickerStyles {
    return {
      content_container: {
        paddingHorizontal: scaleByBreakpoints([16, 116, 216, 316]),
        paddingBottom: scaleByFactor(20),
      },

      item_touchable: {
        marginTop: scaleByFactor(20),
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(14),
        borderRadius: scaleByFactor(4),
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
      },

      flag_icon: {
        marginRight: scaleByFactor(8),
      },

      item_text: {
        fontSize: scaleByFactor(17),
        fontWeight: 'bold',
        color: '#777',
      },
    };
  }

  public lightStyles(): Partial<SimpleLanguagePickerStyles> {
    return {};
  }

  public darkStyles(): Partial<SimpleLanguagePickerStyles> {
    return {};
  }
}

export const simpleLanguagePickerResponsiveStyles = new SimpleLanguagePickerResponsiveStyles();
