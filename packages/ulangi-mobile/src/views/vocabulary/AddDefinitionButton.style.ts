/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AddDefinitionButtonStyles {
  add_button: ViewStyle;
}

export class AddDefinitionButtonResponsiveStyles extends ResponsiveStyleSheet<
  AddDefinitionButtonStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AddDefinitionButtonStyles {
    return {
      add_button: {
        height: scaleByFactor(30),
        width: scaleByFactor(32),
        borderRadius: scaleByFactor(3),
        borderWidth: 1,
        marginLeft: scaleByFactor(7),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.75,
        shadowOpacity: 0.15,
        elevation: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
      },
    };
  }

  public lightStyles(): Partial<AddDefinitionButtonStyles> {
    return {
      add_button: {
        borderColor: config.styles.light.primaryBorderColor,
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },
    };
  }

  public darkStyles(): Partial<AddDefinitionButtonStyles> {
    return {
      add_button: {
        borderColor: config.styles.dark.primaryBorderColor,
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },
    };
  }
}

export const addDefinitionButtonResponsiveStyles = new AddDefinitionButtonResponsiveStyles();
