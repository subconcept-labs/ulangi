/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SynchronizerScreenStyles {
  screen: ViewStyle;
  indicator: ViewStyle;
  icon: ImageStyle;
  sync_btn: ViewStyle;
  sync_btn_text: TextStyle;
  sync_state_container: ViewStyle;
  sync_state: TextStyle;
  title: TextStyle;
  paragraph: TextStyle;
}

export class SynchronizerScreenResponsiveStyles extends ResponsiveStyleSheet<
  SynchronizerScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SynchronizerScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      indicator: {
        marginRight: scaleByFactor(4),
      },

      icon: {
        marginRight: scaleByFactor(4),
      },

      sync_btn: {
        marginLeft: scaleByFactor(16),
        borderRadius: scaleByFactor(3),
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: scaleByFactor(10),
        paddingVertical: scaleByFactor(5),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.75,
        shadowOpacity: 0.2,
        elevation: 1,
      },

      sync_btn_text: {
        fontSize: scaleByFactor(14),
      },

      sync_state_container: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      sync_state: {
        fontSize: scaleByFactor(16),
      },

      title: {
        fontSize: scaleByFactor(15),
        fontWeight: 'bold',
      },

      paragraph: {
        paddingVertical: scaleByFactor(6),
        lineHeight: scaleByFactor(19),
        fontSize: scaleByFactor(14),
      },
    };
  }

  public lightStyles(): Partial<SynchronizerScreenStyles> {
    return {
      sync_btn: {
        borderColor: config.styles.light.primaryBorderColor,
        backgroundColor: config.styles.light.secondaryBackgroundColor,
      },

      sync_btn_text: {
        color: config.styles.light.primaryTextColor,
      },

      sync_state: {
        color: config.styles.light.primaryTextColor,
      },

      title: {
        color: config.styles.light.secondaryTextColor,
      },

      paragraph: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SynchronizerScreenStyles> {
    return {
      sync_btn: {
        borderColor: config.styles.dark.primaryBorderColor,
        backgroundColor: config.styles.dark.secondaryBackgroundColor,
      },

      sync_btn_text: {
        color: config.styles.dark.primaryTextColor,
      },

      sync_state: {
        color: config.styles.dark.primaryTextColor,
      },

      title: {
        color: config.styles.dark.secondaryTextColor,
      },

      paragraph: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const synchronizerScreenResponsiveStyles = new SynchronizerScreenResponsiveStyles();
