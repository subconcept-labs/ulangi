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

export interface PremiumMembershipStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  feature_list_container: ViewStyle;
  button_container: ViewStyle;
  loading_text: TextStyle;
  note_container: ViewStyle;
  thank_you_container: ViewStyle;
  note: TextStyle;
  feature_request_btn: ViewStyle;
  highlighted: TextStyle;
}

export class PremiumMembershipResponsiveStyles extends ResponsiveStyleSheet<
  PremiumMembershipStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): PremiumMembershipStyles {
    return {
      container: {
        paddingVertical: scaleByFactor(50),
        flex: 1,
        backgroundColor: config.styles.premiumMembershipColor,
        justifyContent: 'center',
        alignItems: 'center',
      },

      title_container: {},

      feature_list_container: {
        alignSelf: 'stretch',
        paddingTop: scaleByFactor(40),
      },

      button_container: {
        alignSelf: 'stretch',
        paddingTop: scaleByFactor(20),
      },

      loading_text: {
        textAlign: 'center',
        paddingTop: scaleByFactor(4),
        fontSize: scaleByFactor(14),
        fontWeight: '700',
        color: 'white',
      },

      note_container: {
        paddingTop: scaleByFactor(16),
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },

      thank_you_container: {
        paddingTop: scaleByFactor(40),
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },

      note: {
        textAlign: 'center',
        fontSize: scaleByFactor(14),
        color: '#ffffff98',
      },

      feature_request_btn: {
        paddingTop: scaleByFactor(2),
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      highlighted: {
        textAlign: 'center',
        fontSize: scaleByFactor(14),
        color: '#fff',
      },
    };
  }

  public lightStyles(): Partial<PremiumMembershipStyles> {
    return {};
  }

  public darkStyles(): Partial<PremiumMembershipStyles> {
    return {};
  }
}

export const premiumMembershipResponsiveStyles = new PremiumMembershipResponsiveStyles();
