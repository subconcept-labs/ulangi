/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface CreateFirstSetScreenStyles {
  screen: ViewStyle;
  title_container: ViewStyle;
  title_text: TextStyle;
}

export class CreateFirstSetScreenResponsiveStyles extends ResponsiveStyleSheet<
  CreateFirstSetScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): CreateFirstSetScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      title_container: {
        alignItems: 'center',
        marginTop: scaleByFactor(20),
        marginBottom: scaleByFactor(20),
      },

      title_text: {
        fontSize: scaleByFactor(20),
        color: 'white',
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<CreateFirstSetScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<CreateFirstSetScreenStyles> {
    return {};
  }
}

export const createFirstSetScreenResponsiveStyles = new CreateFirstSetScreenResponsiveStyles();
