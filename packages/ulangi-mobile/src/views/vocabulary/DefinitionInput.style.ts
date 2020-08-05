/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DefinitionInputStyles {
  meaning_container: ViewStyle;
  meaning_input: TextStyle;
}

export class DefinitionInputResponsiveStyles extends ResponsiveStyleSheet<
  DefinitionInputStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): DefinitionInputStyles {
    return {
      meaning_container: {
        paddingHorizontal: scaleByFactor(16),
      },

      meaning_input: {
        paddingHorizontal: scaleByFactor(0),
        paddingVertical: scaleByFactor(16),
        fontSize: scaleByFactor(16),
        textAlignVertical: 'top',
      },
    };
  }

  public lightStyles(): Partial<DefinitionInputStyles> {
    return {
      meaning_input: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<DefinitionInputStyles> {
    return {
      meaning_input: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const definitionInputResponsiveStyles = new DefinitionInputResponsiveStyles();
