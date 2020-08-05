/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SetManagementLoadingMessageStyles {
  loading_message_container: ViewStyle;
  loading_message: TextStyle;
}

export class SetManagementLoadingMessageResponsiveStyles extends ResponsiveStyleSheet<
  SetManagementLoadingMessageStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): SetManagementLoadingMessageStyles {
    return {
      loading_message_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },

      loading_message: {
        fontSize: scaleByFactor(16),
        color: '#999',
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<SetManagementLoadingMessageStyles> {
    return {};
  }

  public darkStyles(): Partial<SetManagementLoadingMessageStyles> {
    return {};
  }
}

export const setManagementLoadingMessageResponsiveStyles = new SetManagementLoadingMessageResponsiveStyles();
