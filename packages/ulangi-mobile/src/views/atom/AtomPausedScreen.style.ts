/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AtomPausedScreenStyles {
  screen: ViewStyle;
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
  title_container: ViewStyle;
  title_text: TextStyle;
  content_container: ViewStyle;
  button_touchable: ViewStyle;
  button_text: TextStyle;
}

export class AtomPausedScreenResponsiveStyles extends ResponsiveStyleSheet<
  AtomPausedScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AtomPausedScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      light_box_container: {
        justifyContent: 'center',
      },

      inner_container: {
        alignSelf: 'stretch',
        marginHorizontal: scaleByFactor(16),
        marginVertical: scaleByFactor(16),
        borderRadius: scaleByFactor(16),
        backgroundColor: '#f8f3d4',
        overflow: 'hidden',
      },

      title_container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: scaleByFactor(16),
        borderBottomColor: '#a6a28d',
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: '#e3dec1',
      },

      title_text: {
        fontSize: scaleByFactor(20),
        fontFamily: 'JosefinSans-Bold',
        textAlign: 'center',
        color: '#444',
      },

      content_container: {
        paddingVertical: scaleByFactor(20),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      },

      button_touchable: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      button_text: {
        fontFamily: 'JosefinSans',
        color: '#444',
        fontSize: scaleByFactor(18),
        paddingTop: scaleByFactor(5),
      },
    };
  }

  public lightStyles(): Partial<AtomPausedScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomPausedScreenStyles> {
    return {};
  }
}

export const atomPausedScreenResponsiveStyles = new AtomPausedScreenResponsiveStyles();
