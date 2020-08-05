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
} from '../../utils/responsive';

export interface SpacedRepetitionMenuStyles {
  container: ViewStyle;
  primary_button_container: ViewStyle;
  secondary_button_container: ViewStyle;
}

export class SpacedRepetitionMenuResponsiveStyles extends ResponsiveStyleSheet<
  SpacedRepetitionMenuStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): SpacedRepetitionMenuStyles {
    return {
      container: {
        marginTop: scaleByFactor(40),
        marginHorizontal: scaleByBreakpoints([16, 116, 216, 316]),
      },
      primary_button_container: {
        marginHorizontal: scaleByFactor(5),
        marginVertical: scaleByFactor(6),
      },
      secondary_button_container: {
        marginHorizontal: scaleByFactor(22),
        marginVertical: scaleByFactor(6),
      },
    };
  }

  public lightStyles(): Partial<SpacedRepetitionMenuStyles> {
    return {};
  }

  public darkStyles(): Partial<SpacedRepetitionMenuStyles> {
    return {};
  }
}

export const spacedRepetitionMenuResponsiveStyles = new SpacedRepetitionMenuResponsiveStyles();
