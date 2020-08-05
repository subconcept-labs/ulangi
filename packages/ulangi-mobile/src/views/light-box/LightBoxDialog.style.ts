/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LightBoxDialogStyles {
  dialog_container: ViewStyle;
}

export class LightBoxDialogResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxDialogStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LightBoxDialogStyles {
    return {
      dialog_container: {
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        borderRadius: scaleByFactor(3),
        marginVertical: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<LightBoxDialogStyles> {
    return {
      dialog_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },
    };
  }

  public darkStyles(): Partial<LightBoxDialogStyles> {
    return {
      dialog_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },
    };
  }
}

export const lightBoxDialogResponsiveStyles = new LightBoxDialogResponsiveStyles();
