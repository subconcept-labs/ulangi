/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SelectableImageStyles {
  image_container: ViewStyle;
  image: ImageStyle;
  selected: ImageStyle;
}

export class SelectableImageResponsiveStyles extends ResponsiveStyleSheet<
  SelectableImageStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SelectableImageStyles {
    return {
      image_container: {},

      image: {
        backgroundColor: '#ddd',
      },

      selected: {
        borderWidth: scaleByFactor(3),
        borderColor: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<SelectableImageStyles> {
    return {};
  }

  public darkStyles(): Partial<SelectableImageStyles> {
    return {};
  }
}

export const selectableImageResponsiveStyles = new SelectableImageResponsiveStyles();
