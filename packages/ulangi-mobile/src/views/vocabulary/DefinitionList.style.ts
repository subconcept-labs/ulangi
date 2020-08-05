/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DefinitionListStyles {
  definition_list: ViewStyle;
  missing_definitions_container: ViewStyle;
  missing_definitions: TextStyle;
}

export class DefinitionListResponsiveStyles extends ResponsiveStyleSheet<
  DefinitionListStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): DefinitionListStyles {
    return {
      definition_list: {},

      missing_definitions_container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingVertical: scaleByFactor(10),
        paddingHorizontal: scaleByFactor(16),
      },

      missing_definitions: {
        fontSize: scaleByFactor(15),
        fontStyle: 'italic',
        color: '#777',
      },
    };
  }

  public lightStyles(): Partial<DefinitionListStyles> {
    return {
      missing_definitions_container: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },

      missing_definitions: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<DefinitionListStyles> {
    return {
      missing_definitions_container: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },

      missing_definitions: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const definitionListResponsiveStyles = new DefinitionListResponsiveStyles();
