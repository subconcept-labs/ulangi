/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../../utils/responsive';

export interface SubmitButtonStyles {
  button_touchable: ViewStyle;
  button_text: TextStyle;
}

export class SubmitButtonResponsiveStyles extends ResponsiveStyleSheet<
  SubmitButtonStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): SubmitButtonStyles {
    return {
      button_touchable: {
        alignSelf: 'stretch',
        paddingHorizontal: scaleByFactor(10),
        paddingVertical: scaleByFactor(12),
        borderRadius: scaleByFactor(4),
        marginTop: scaleByFactor(8),
        marginHorizontal: scaleByBreakpoints([16, 116, 216, 316]),
        backgroundColor: '#00c7fe',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
      },

      button_text: {
        color: 'white',
        fontSize: scaleByFactor(17),
        fontFamily: 'Arial',
        fontWeight: '700',
        textAlign: 'center',
      },
    };
  }

  public lightStyles(): Partial<SubmitButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<SubmitButtonStyles> {
    return {};
  }
}

export const submitButtonResponsiveStyles = new SubmitButtonResponsiveStyles();
