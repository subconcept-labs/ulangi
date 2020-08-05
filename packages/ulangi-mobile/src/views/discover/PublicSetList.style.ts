/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface PublicSetListStyles {
  list_container: ViewStyle;
  center_container: ViewStyle;
  message: TextStyle;
  button_container: ViewStyle;
}

export class PublicSetListResponsiveStyles extends ResponsiveStyleSheet<
  PublicSetListStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): PublicSetListStyles {
    return {
      list_container: {
        paddingBottom: scaleByFactor(74),
        paddingTop: scaleByFactor(8),
      },

      center_container: {
        flex: 1,
        paddingHorizontal: scaleByFactor(16),
        marginTop: scaleByFactor(8),
        justifyContent: 'center',
        alignItems: 'center',
      },

      message: {
        fontSize: scaleByFactor(15),
        textAlign: 'center',
      },

      button_container: {
        marginTop: scaleByFactor(8),
      },
    };
  }

  public lightStyles(): Partial<PublicSetListStyles> {
    return {
      message: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<PublicSetListStyles> {
    return {
      message: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const publicSetListResponsiveStyles = new PublicSetListResponsiveStyles();
