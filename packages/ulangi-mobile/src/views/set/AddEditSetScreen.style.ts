/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface AddEditSetScreenStyles {
  screen: ViewStyle;
}

export class AddEditSetScreenResponsiveStyles extends ResponsiveStyleSheet<
  AddEditSetScreenStyles
> {
  public baseStyles(): AddEditSetScreenStyles {
    return {
      screen: {
        flex: 1,
      },
    };
  }

  public lightStyles(): Partial<AddEditSetScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<AddEditSetScreenStyles> {
    return {};
  }
}

export const addEditSetScreenResponsiveStyles = new AddEditSetScreenResponsiveStyles();
