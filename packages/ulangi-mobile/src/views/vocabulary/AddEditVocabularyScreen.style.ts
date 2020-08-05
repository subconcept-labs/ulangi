/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AddEditVocabularyScreenStyles {
  screen: ViewStyle;
  scrollview: ViewStyle;
  preview_container: ViewStyle;
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
    };
  }

  public lightStyles(): Partial<AddEditVocabularyScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<AddEditVocabularyScreenStyles> {
    return {};
  }
}

export const addEditVocabularyScreenResponsiveStyles = new AddEditVocabularyScreenResponsiveStyles();
