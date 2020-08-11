/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface AtomTutorialContentStyles {
  container: ViewStyle;
  content_container: ViewStyle;
  content: TextStyle;
  highlighted: TextStyle;
  chracter: TextStyle;
  button_container: ViewStyle;
}

export class AtomTutorialContentResponsiveStyles extends ResponsiveStyleSheet<
  AtomTutorialContentStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): AtomTutorialContentStyles {
    return {
      container: {
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },

      content_container: {},

      content: {
        fontSize: scaleByFactor(15),
        color: config.atom.textColor,
        lineHeight: scaleByFactor(19),
      },

      highlighted: {
        color: '#06d3c2',
        fontWeight: 'bold',
      },

      chracter: {
        color: '#06d3c2',
        fontWeight: 'bold',
      },

      button_container: {
        marginTop: scaleByFactor(6),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
    };
  }

  public lightStyles(): Partial<AtomTutorialContentStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomTutorialContentStyles> {
    return {};
  }
}

export const atomTutorialContentResponsiveStyles = new AtomTutorialContentResponsiveStyles();
