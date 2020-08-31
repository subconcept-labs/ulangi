/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DefinitionItemStyles {
  item_container: ViewStyle;
  meaning_container: ViewStyle;
  plain_meaning_container: ViewStyle;
  plain_meaning: TextStyle;
}

export class DefinitionItemResponsiveStyles extends ResponsiveStyleSheet<
  DefinitionItemStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): DefinitionItemStyles {
    return {
      item_container: {
        paddingVertical: scaleByFactor(2),
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      meaning_container: {
        paddingVertical: scaleByFactor(10),
        paddingHorizontal: scaleByFactor(16),
        flexDirection: 'row',
        alignItems: 'center',
      },

      plain_meaning_container: {
        flexShrink: 1,
        paddingVertical: scaleByFactor(3),
      },

      plain_meaning: {
        fontSize: scaleByFactor(17),
      },
    };
  }

  public lightStyles(): Partial<DefinitionItemStyles> {
    return {
      item_container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: config.styles.light.secondaryBorderColor,
      },
      plain_meaning: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<DefinitionItemStyles> {
    return {
      item_container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: config.styles.dark.secondaryBorderColor,
      },
      plain_meaning: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const definitionItemResponsiveStyles = new DefinitionItemResponsiveStyles();
