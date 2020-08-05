/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SpacedRepetitionScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  middle_container: ViewStyle;
  title_container: ViewStyle;
  menu_container: ViewStyle;
  bottom_container: ViewStyle;
  note: TextStyle;
  highlighted: TextStyle;
  selected_categories_container: ViewStyle;
}

export class SpacedRepetitionScreenResponsiveStyles extends ResponsiveStyleSheet<
  SpacedRepetitionScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): SpacedRepetitionScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      container: {
        flex: 1,
      },

      middle_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },

      title_container: {
        alignSelf: 'stretch',
        marginTop: scaleByFactor(-50),
      },

      menu_container: {
        alignSelf: 'stretch',
      },

      bottom_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: scaleByFactor(16),
      },

      note: {
        fontSize: scaleByFactor(14),
        lineHeight: scaleByFactor(19),
        textAlign: 'center',
        color: '#777',
      },

      highlighted: {
        color: config.styles.primaryColor,
      },

      selected_categories_container: {
        marginTop: scaleByFactor(50),
      },
    };
  }

  public lightStyles(): Partial<SpacedRepetitionScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<SpacedRepetitionScreenStyles> {
    return {};
  }
}

export const spacedRepetitionScreenResponsiveStyles = new SpacedRepetitionScreenResponsiveStyles();
