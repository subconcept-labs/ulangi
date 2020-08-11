/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../../utils/responsive';

export interface ManageScreenStyles {
  screen: ViewStyle;
  bulk_action_bar_container: ViewStyle;
  floating_action_button: TextStyle;
  syncing_notice: TextStyle;
}

export class ManageScreenResponsiveStyles extends ResponsiveStyleSheet<
  ManageScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    _: ScaleByBreakpoints,
    layout: { width: number; height: number },
  ): ManageScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      bulk_action_bar_container: {
        position: 'absolute',
        left: 0,
        bottom: 0,
      },

      floating_action_button: {
        position: 'absolute',
        right: scaleByFactor(14),
        bottom: scaleByFactor(14),
      },

      syncing_notice: {
        position: 'absolute',
        bottom: scaleByFactor(16),
        flexDirection: 'row',
        justifyContent: 'center',
        left: (layout.width - scaleByFactor(120)) / 2,
        width: scaleByFactor(120),
      },
    };
  }

  public lightStyles(): Partial<ManageScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<ManageScreenStyles> {
    return {
      screen: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#131313',
      },
    };
  }
}

export const manageScreenResponsiveStyles = new ManageScreenResponsiveStyles();
