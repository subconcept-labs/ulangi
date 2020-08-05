/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';
import {
  SectionRowResponsiveStyles,
  SectionRowStyles,
} from '../section/SectionRow.style';

export interface MoreScreenStyles {
  screen: ViewStyle;
  scroll_view_container: ViewStyle;
  section_list: ViewStyle;
  description_text: TextStyle;
  left_icon: ImageStyle;
}

export class MoreScreenResponsiveStyles extends ResponsiveStyleSheet<
  MoreScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): MoreScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      scroll_view_container: {
        flex: 1,
      },

      section_list: {
        marginTop: scaleByFactor(22),
      },

      description_text: {},

      left_icon: {
        marginRight: scaleByFactor(4),
      },
    };
  }

  public lightStyles(): Partial<MoreScreenStyles> {
    return {
      description_text: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<MoreScreenStyles> {
    return {
      screen: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#131313',
      },
      description_text: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export class RegularSectionRowResponsiveStyles extends SectionRowResponsiveStyles {
  public baseStyles(scaleByFactor: ScaleByFactor): SectionRowStyles {
    return _.merge({}, super.baseStyles(scaleByFactor), {
      right_text: {
        color: config.styles.regularMembershipColor,
        fontWeight: 'bold',
      },
    });
  }
}

export class PremiumSectionRowResponsiveStyles extends SectionRowResponsiveStyles {
  public baseStyles(scaleByFactor: ScaleByFactor): SectionRowStyles {
    return _.merge({}, super.baseStyles(scaleByFactor), {
      right_text: {
        color: config.styles.premiumMembershipColor,
        fontWeight: 'bold',
      },
    });
  }
}
export const moreScreenResponsiveStyles = new MoreScreenResponsiveStyles();
export const regularSectionRowResponsiveStyles = new RegularSectionRowResponsiveStyles();
export const premiumSectionRowResponsiveStyles = new PremiumSectionRowResponsiveStyles();
