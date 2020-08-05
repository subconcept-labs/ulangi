/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AtomQuestionStyles {
  container: ViewStyle;
  hint_container: ViewStyle;
  label: TextStyle;
  hint: TextStyle;
  vocabulary_text_container: ViewStyle;
  vocabulary_text_with_underscores: TextStyle;
  underscores: TextStyle;
}

export class AtomQuestionResponsiveStyles extends ResponsiveStyleSheet<
  AtomQuestionStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AtomQuestionStyles {
    return {
      container: {
        zIndex: -1,
        marginTop: scaleByFactor(15),
        marginHorizontal: scaleByFactor(32),
        alignItems: 'center',
        justifyContent: 'center',
      },

      hint_container: {
        marginTop: scaleByFactor(14),
        paddingHorizontal: scaleByFactor(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },

      label: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(13),
        paddingRight: scaleByFactor(4),
        color: '#91aa9d',
      },

      hint: {
        fontSize: scaleByFactor(13),
        color: '#91aa9d',
      },

      vocabulary_text_container: {},

      vocabulary_text_with_underscores: {
        color: config.atom.textColor,
        fontSize: scaleByFactor(17),
        fontWeight: 'bold',
        textShadowColor: '#00000012',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 0,
      },

      underscores: {
        color: config.atom.textColor,
        fontSize: scaleByFactor(17),
        letterSpacing: 1,
      },
    };
  }

  public lightStyles(): Partial<AtomQuestionStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomQuestionStyles> {
    return {};
  }
}

export const atomQuestionResponsiveStyles = new AtomQuestionResponsiveStyles();
