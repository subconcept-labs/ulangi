/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReflexAnswerButtonStyles {
  vertical_axis_container: ViewStyle;
  horizontal_axis_container: ViewStyle;
  start_button: ViewStyle;
  start_text: TextStyle;
  touchable: ViewStyle;
  touchable_text: TextStyle;
  touchable_text_green: TextStyle;
  touchable_text_red: TextStyle;
  note_container: ViewStyle;
  note: TextStyle;
}

export class ReflexAnswerButtonResponsiveStyles extends ResponsiveStyleSheet<
  ReflexAnswerButtonStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReflexAnswerButtonStyles {
    return {
      vertical_axis_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: scaleByFactor(16),
      },

      horizontal_axis_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: scaleByFactor(8),
      },

      start_button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scaleByFactor(16),
        alignSelf: 'stretch',
        backgroundColor: 'mintcream',
        borderRadius: scaleByFactor(8),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        elevation: 2,
      },

      start_text: {
        fontFamily: 'Raleway-Black',
        color: '#2fc68f',
        paddingVertical: scaleByFactor(16),
        fontSize: scaleByFactor(35),
      },

      touchable: {
        marginHorizontal: scaleByFactor(8),
        marginVertical: scaleByFactor(30),
        justifyContent: 'center',
        alignItems: 'center',
        height: scaleByFactor(120),
        flex: 1,
        backgroundColor: 'mintcream',
        borderRadius: scaleByFactor(8),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        elevation: 2,
      },

      touchable_text: {
        fontFamily: 'Raleway-Black',
        fontSize: scaleByFactor(35),
      },

      touchable_text_green: {
        color: '#2fc68f',
      },

      touchable_text_red: {
        color: '#ff7396',
      },

      note_container: {
        marginBottom: scaleByFactor(16),
      },

      note: {
        fontSize: scaleByFactor(14),
        lineHeight: scaleByFactor(19),
        textAlign: 'center',
        color: '#21eddc',
      },
    };
  }

  public lightStyles(): Partial<ReflexAnswerButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<ReflexAnswerButtonStyles> {
    return {};
  }
}

export const reflexAnswerButtonResponsiveStyles = new ReflexAnswerButtonResponsiveStyles();
