/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AddEditVocabularyScreenStyles {
  screen: ViewStyle;
  scrollview: ViewStyle;
  preview_container: ViewStyle;
  tip_container: ViewStyle;
  tip: TextStyle;
  bold: TextStyle;
}

export class AddEditVocabularyScreenResponsiveStyles extends ResponsiveStyleSheet<
  AddEditVocabularyScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): AddEditVocabularyScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      scrollview: {
        flex: 1,
      },

      preview_container: {
        flexGrow: 1,
        paddingTop: scaleByFactor(16),
        alignSelf: 'stretch',
        justifyContent: 'center',
      },

      tip_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(14),
      },

      tip: {
        textAlign: 'center',
        fontSize: scaleByFactor(13),
      },

      bold: {
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<AddEditVocabularyScreenStyles> {
    return {
      tip: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<AddEditVocabularyScreenStyles> {
    return {
      tip: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const addEditVocabularyScreenResponsiveStyles = new AddEditVocabularyScreenResponsiveStyles();
