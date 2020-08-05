/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface AutoArchiveScreenStyles {
  screen: ViewStyle;
}

export class AutoArchiveScreenResponsiveStyles extends ResponsiveStyleSheet<
  AutoArchiveScreenStyles
> {
  public baseStyles(): AutoArchiveScreenStyles {
    return {
      screen: {
        flex: 1,
      },
    };
  }

  public lightStyles(): Partial<AutoArchiveScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<AutoArchiveScreenStyles> {
    return {};
  }
}

export const autoArchiveScreenResponsiveStyles = new AutoArchiveScreenResponsiveStyles();
