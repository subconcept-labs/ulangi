/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AtomGameOverScreenStyles {
  screen: ViewStyle;
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
  title_container: ViewStyle;
  title_text: TextStyle;
  content_container: ViewStyle;
  result_container: ViewStyle;
  score_container: ViewStyle;
  score_text: TextStyle;
  score_number: TextStyle;
  button_container: ViewStyle;
}

export class AtomGameOverScreenResponsiveStyles extends ResponsiveStyleSheet<
  AtomGameOverScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AtomGameOverScreenStyles {
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
      },

      result_container: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      score_container: {
        height: scaleByFactor(100),
        width: scaleByFactor(100),
        borderRadius: scaleByFactor(100) / 2,
        borderColor: '#ccc99b',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: scaleByFactor(6),
      },

      score_text: {
        fontSize: scaleByFactor(12),
        fontWeight: 'bold',
        color: '#444',
      },

      score_number: {
        fontSize: scaleByFactor(18),
        fontFamily: 'JosefinSans-Bold',
        color: '#444',
      },

      button_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: scaleByFactor(16),
        paddingHorizontal: scaleByFactor(8),
      },
    };
  }

  public lightStyles(): Partial<AtomGameOverScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomGameOverScreenStyles> {
    return {};
  }
}

export const atomGameOverScreenResponsiveStyles = new AtomGameOverScreenResponsiveStyles();
