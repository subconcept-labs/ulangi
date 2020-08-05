/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface RegularMembershipStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  feature_list_container: ViewStyle;
}

export class RegularMembershipResponsiveStyles extends ResponsiveStyleSheet<
  RegularMembershipStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): RegularMembershipStyles {
    return {
      container: {
        flex: 1,
        paddingVertical: scaleByFactor(50),
        backgroundColor: config.styles.regularMembershipColor,
        justifyContent: 'center',
        alignItems: 'center',
      },

      title_container: {},

      feature_list_container: {
        alignSelf: 'stretch',
        paddingTop: scaleByFactor(40),
      },
    };
  }

  public lightStyles(): Partial<RegularMembershipStyles> {
    return {};
  }

  public darkStyles(): Partial<RegularMembershipStyles> {
    return {};
  }
}

export const regularMembershipResponsiveStyles = new RegularMembershipResponsiveStyles();
