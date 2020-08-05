/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Dimensions, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DefinitionExtraFieldListStyles {
  container: ViewStyle;
  field_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  name: TextStyle;
  image_list: ViewStyle;
  image_container: ViewStyle;
  image: ViewStyle;
  value: TextStyle;
}

export class DefinitionExtraFieldListResponsiveStyles extends ResponsiveStyleSheet<
  DefinitionExtraFieldListStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): DefinitionExtraFieldListStyles {
    return {
      container: {
        marginHorizontal: scaleByFactor(16),
      },

      field_container: {
        marginBottom: scaleByFactor(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      left: {},

      right: {},

      name: {
        fontSize: scaleByFactor(13),
        fontWeight: 'bold',
      },

      image_list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: scaleByFactor(-8),
      },

      image_container: {
        paddingHorizontal: scaleByFactor(8),
        paddingVertical: scaleByFactor(10),
      },

      image: {
        backgroundColor: '#e3e3e3',
        width: Dimensions.get('window').width / scaleByFactor(3),
        height: Dimensions.get('window').width / scaleByFactor(3),
      },

      value: {
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<DefinitionExtraFieldListStyles> {
    return {
      name: {
        color: config.styles.light.secondaryTextColor,
      },

      image: {
        backgroundColor: '#e3e3e3',
      },

      value: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<DefinitionExtraFieldListStyles> {
    return {
      name: {
        color: config.styles.dark.secondaryTextColor,
      },

      image: {
        backgroundColor: '#e3e3e3',
      },

      value: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const definitionExtraFieldListResponsiveStyles = new DefinitionExtraFieldListResponsiveStyles();
