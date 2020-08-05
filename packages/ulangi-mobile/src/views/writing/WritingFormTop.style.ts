/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface WritingFormTopStyles {
  container: ViewStyle;
  top_container: ViewStyle;
  number_container: ViewStyle;
  number: TextStyle;
  placeholder: ViewStyle;
  button_container: ViewStyle;
  note_container: ViewStyle;
  note: TextStyle;
}

export class WritingFormTopResponsiveStyles extends ResponsiveStyleSheet<
  WritingFormTopStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): WritingFormTopStyles {
    return {
      container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        marginTop: scaleByFactor(20),
        marginBottom: scaleByFactor(20),
      },

      top_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      number_container: {
        height: scaleByFactor(24),
        paddingHorizontal: scaleByFactor(16),
        borderRadius: scaleByFactor(12),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },

      number: {
        fontSize: scaleByFactor(15),
        fontWeight: 'bold',
      },

      placeholder: {
        height: scaleByFactor(24),
        flex: 1,
      },

      button_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },

      note_container: {
        marginTop: scaleByFactor(6),
      },

      note: {
        fontSize: scaleByFactor(14),
        textAlign: 'center',
      },
    };
  }

  public lightStyles(): Partial<WritingFormTopStyles> {
    return {
      number_container: {
        borderColor: config.styles.light.secondaryTextColor,
      },

      number: {
        color: config.styles.light.secondaryTextColor,
      },

      note: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<WritingFormTopStyles> {
    return {
      number_container: {
        borderColor: config.styles.dark.secondaryTextColor,
      },

      number: {
        color: config.styles.dark.secondaryTextColor,
      },

      note: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const writingFormTopResponsiveStyles = new WritingFormTopResponsiveStyles();
