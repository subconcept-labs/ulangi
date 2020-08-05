/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReflexGameOverScreenStyles {
  screen: ViewStyle;
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  score_container: ViewStyle;
  score_text: TextStyle;
  spacer: ViewStyle;
}

export class ReflexGameOverScreenResponsiveStyles extends ResponsiveStyleSheet<
  ReflexGameOverScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReflexGameOverScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      light_box_container: {
        justifyContent: 'center',
      },

      inner_container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        marginTop: scaleByFactor(-30),
      },

      title_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scaleByFactor(8),
      },

      title: {
        fontSize: scaleByFactor(34),
        fontFamily: 'Raleway-Black',
        textAlign: 'center',
        color: '#fff',
      },

      score_container: {
        borderColor: config.reflex.backgroundColor,
        borderWidth: scaleByFactor(3),
        height: scaleByFactor(100),
        width: scaleByFactor(100),
        borderRadius: scaleByFactor(50),
        marginVertical: scaleByFactor(10),
        justifyContent: 'center',
        alignItems: 'center',
      },

      score_text: {
        fontFamily: 'Raleway-Black',
        fontSize: 30,
        color: config.reflex.backgroundColor,
      },

      spacer: {
        height: 30,
      },
    };
  }

  public lightStyles(): Partial<ReflexGameOverScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<ReflexGameOverScreenStyles> {
    return {};
  }
}

export const reflexGameOverScreenResponsiveStyles = new ReflexGameOverScreenResponsiveStyles();
