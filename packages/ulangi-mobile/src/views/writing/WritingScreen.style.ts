/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface WritingScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  middle_container: ViewStyle;
  title_container: ViewStyle;
  menu_container: ViewStyle;
  selected_categories_container: ViewStyle;
}

export class WritingScreenResponsiveStyles extends ResponsiveStyleSheet<
  WritingScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): WritingScreenStyles {
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

      selected_categories_container: {
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        marginTop: scaleByFactor(50),
      },
    };
  }

  public lightStyles(): Partial<WritingScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<WritingScreenStyles> {
    return {};
  }
}

export const writingScreenResponsiveStyles = new WritingScreenResponsiveStyles();
