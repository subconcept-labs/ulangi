/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface RegularFeatureListStyles {
  box: ViewStyle;
  no_top_border: ViewStyle;
  feature_container: ViewStyle;
  bullet: ImageStyle;
  text_container: ViewStyle;
  text: TextStyle;
  highlighted: TextStyle;
}

export class RegularFeatureListResponsiveStyles extends ResponsiveStyleSheet<
  RegularFeatureListStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): RegularFeatureListStyles {
    return {
      box: {
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        paddingHorizontal: scaleByFactor(18),
        backgroundColor: '#f9f9f9',
        borderRadius: scaleByFactor(5),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 0.5,
        shadowOpacity: 0.2,
        elevation: 1,
        borderTopColor: '#aaa',
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      no_top_border: {
        borderTopWidth: scaleByFactor(0),
      },

      feature_container: {
        alignSelf: 'stretch',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#cecece',
        flexDirection: 'row',
        paddingVertical: scaleByFactor(5),
        alignItems: 'center',
      },

      bullet: {
        marginRight: scaleByFactor(8),
      },

      text_container: {
        flexShrink: 1,
        paddingVertical: scaleByFactor(8),
      },

      text: {
        fontSize: scaleByFactor(15),
        color: '#333',
        lineHeight: scaleByFactor(19),
      },

      highlighted: {
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<RegularFeatureListStyles> {
    return {};
  }

  public darkStyles(): Partial<RegularFeatureListStyles> {
    return {};
  }
}

export const regularFeatureListResponsiveStyles = new RegularFeatureListResponsiveStyles();
