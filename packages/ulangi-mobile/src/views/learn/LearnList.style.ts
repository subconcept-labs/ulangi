/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface LearnListStyles {
  scroll_view_container: ViewStyle;
  learn_item: ViewStyle;
  spaced_repetition_title_container: ViewStyle;
  writing_title_container: ViewStyle;
  quiz_title_container: ViewStyle;
  reflex_title_container: ViewStyle;
  atom_title_container: ViewStyle;
}

export class LearnListResponsiveStyles extends ResponsiveStyleSheet<
  LearnListStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): LearnListStyles {
    return {
      scroll_view_container: {
        paddingBottom: scaleByFactor(16),
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },

      learn_item: {
        backgroundColor: '#fff',
        borderRadius: scaleByFactor(10),
        marginTop: scaleByFactor(16),
        height: scaleByFactor(180),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.3 },
        shadowRadius: 0.75,
        shadowOpacity: 0.18,
      },

      spaced_repetition_title_container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      writing_title_container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      quiz_title_container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      reflex_title_container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00B8A9',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.5,
        shadowOpacity: 0.25,
        elevation: 0.5,
      },

      atom_title_container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: config.atom.backgroundColor,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.5,
        shadowOpacity: 0.25,
        elevation: 0.5,
      },
    };
  }

  public lightStyles(): Partial<LearnListStyles> {
    return {
      learn_item: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        elevation: 1,
      },
    };
  }

  public darkStyles(): Partial<LearnListStyles> {
    return {
      learn_item: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        elevation: 3,
      },
    };
  }
}

export const learnListResponsiveStyles = new LearnListResponsiveStyles();
