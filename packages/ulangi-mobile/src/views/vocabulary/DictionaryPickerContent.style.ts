/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface DictionaryPickerContentStyles {
  picker_content: ViewStyle;
}

export class DictionaryPickerContentResponsiveStyles extends ResponsiveStyleSheet<
  DictionaryPickerContentStyles
> {
  public baseStyles(): DictionaryPickerContentStyles {
    return {
      picker_content: {},
    };
  }

  public lightStyles(): Partial<DictionaryPickerContentStyles> {
    return {};
  }

  public darkStyles(): Partial<DictionaryPickerContentStyles> {
    return {};
  }
}

export const dictionaryPickerContentResponsiveStyles = new DictionaryPickerContentResponsiveStyles();
