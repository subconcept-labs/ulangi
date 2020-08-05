/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface QuickTutorialButtonStyles {
  scroll_view_container: ViewStyle;
  animation_container: ViewStyle;
  add_text: TextStyle;
  button_container: ViewStyle;
  quick_tutorial: TextStyle;
  highlighted: TextStyle;
}

export class QuickTutorialButtonResponsiveStyles extends ResponsiveStyleSheet<
  QuickTutorialButtonStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): QuickTutorialButtonStyles {
    return {
      scroll_view_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
      },

      animation_container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      add_text: {
        textAlign: 'center',
        fontSize: scaleByFactor(15),
        color: '#999',
        paddingTop: scaleByFactor(3),
      },

      button_container: {
        marginTop: scaleByFactor(12),
        height: scaleByFactor(34),
        borderRadius: scaleByFactor(17),
        paddingHorizontal: scaleByFactor(20),
        backgroundColor: config.styles.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 1,
        shadowOpacity: 0.15,
        elevation: 3,
      },

      quick_tutorial: {
        fontSize: scaleByFactor(15),
        lineHeight: scaleByFactor(19),
        fontWeight: '700',
        color: 'white',
      },

      highlighted: {
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<QuickTutorialButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<QuickTutorialButtonStyles> {
    return {};
  }
}

export const quickTutorialButtonResponsiveStyles = new QuickTutorialButtonResponsiveStyles();
