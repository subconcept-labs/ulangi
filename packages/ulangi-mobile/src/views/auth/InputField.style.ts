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
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface InputFieldStyles {
  input_container: ViewStyle;
  input_field: TextStyle;
}

export class InputFieldResponsiveStyles extends ResponsiveStyleSheet<
  InputFieldStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): InputFieldStyles {
    return {
      input_container: {},

      input_field: {
        height: scaleByFactor(46),
        borderRadius: scaleByFactor(4),
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        marginVertical: scaleByFactor(2),
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(14),
        //backgroundColor: '#0083b3',
        backgroundColor: '#eee',
        color: '#545454',
        fontSize: scaleByFactor(15),
        fontWeight: '700',
      },
    };
  }

  public lightStyles(): Partial<InputFieldStyles> {
    return {};
  }

  public darkStyles(): Partial<InputFieldStyles> {
    return {};
  }
}

export const inputFieldResponsiveStyles = new InputFieldResponsiveStyles();
