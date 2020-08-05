/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface EventLogsScreenStyles {
  screen: ViewStyle;
  button_container: ViewStyle;
  paragraph: ViewStyle;
  text: TextStyle;
}

export class EventLogsScreenResponsiveStyles extends ResponsiveStyleSheet<
  EventLogsScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): EventLogsScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      button_container: {
        marginTop: scaleByFactor(10),
        paddingHorizontal: scaleByFactor(16),
      },

      paragraph: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(10),
      },

      text: {
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<EventLogsScreenStyles> {
    return {
      text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<EventLogsScreenStyles> {
    return {
      text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const eventLogsScreenResponsiveStyles = new EventLogsScreenResponsiveStyles();
