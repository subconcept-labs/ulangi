/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DictionaryDefinitionStyles {
  definition_container: ViewStyle;
  definition_content_container: ViewStyle;
  meaning_container: ViewStyle;
  meaning_text: TextStyle;
  add_button_container: ViewStyle;
}

export class DictionaryDefinitionResponsiveStyles extends ResponsiveStyleSheet<
  DictionaryDefinitionStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): DictionaryDefinitionStyles {
    return {
      definition_container: {
        marginHorizontal: scaleByFactor(8),
        paddingVertical: scaleByFactor(16),
        paddingHorizontal: scaleByFactor(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      definition_content_container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
      },

      meaning_container: {
        flexShrink: 1,
      },

      meaning_text: {
        fontSize: scaleByFactor(15),
      },

      add_button_container: {
        marginLeft: scaleByFactor(8),
      },
    };
  }

  public lightStyles(): Partial<DictionaryDefinitionStyles> {
    return {
      definition_container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      meaning_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<DictionaryDefinitionStyles> {
    return {
      definition_container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      meaning_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const dictionaryDefinitionResponsiveStyles = new DictionaryDefinitionResponsiveStyles();
