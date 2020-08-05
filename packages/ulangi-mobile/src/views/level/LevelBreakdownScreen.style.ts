/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';
import {
  LightBoxContainerWithTitleResponsiveStyles,
  LightBoxContainerWithTitleStyles,
} from '../light-box/LightBoxContainerWithTitle.style';

export interface LevelBreakdownScreenStyles {
  screen: ViewStyle;
}

export class LevelBreakdownScreenResponsiveStyles extends ResponsiveStyleSheet<
  LevelBreakdownScreenStyles
> {
  public baseStyles(): LevelBreakdownScreenStyles {
    return {
      screen: {
        flex: 1,
      },
    };
  }

  public lightStyles(): Partial<LevelBreakdownScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<LevelBreakdownScreenStyles> {
    return {};
  }
}

export class ExtendedLightBoxContainerWithTitleResponsiveStyles extends LightBoxContainerWithTitleResponsiveStyles {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): LightBoxContainerWithTitleStyles {
    return _.merge({}, super.baseStyles(scaleByFactor), {
      light_box_container: {
        paddingVertical: 120,
      },
    });
  }
}

export const levelBreakdownScreenResponsiveStyles = new LevelBreakdownScreenResponsiveStyles();

export const lightBoxContainerWithTitleResponsiveStyles = new LightBoxContainerWithTitleResponsiveStyles();
