/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../../utils/responsive';

export interface ImageListStyles {
  container: ViewStyle;
  content_container: ViewStyle;
  header_container: ViewStyle;
  header_text: TextStyle;
  empty_container: ViewStyle;
  empty_text: TextStyle;
  activity_indicator: ViewStyle;
  highlighted: TextStyle;
}

export interface ImageListOptions {
  numColumns: number;
  imagePadding: number;
}

export class ImageListResponsiveStyles extends ResponsiveStyleSheet<
  ImageListStyles,
  ImageListOptions
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    _: ScaleByBreakpoints,
    __: { width: number; height: number },
    options: ImageListOptions,
  ): ImageListStyles {
    const { imagePadding } = options;

    return {
      container: {
        flex: 1,
      },

      content_container: {
        paddingHorizontal: imagePadding,
      },

      header_container: {
        marginHorizontal: -imagePadding,
        marginBottom: imagePadding,
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(9),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      header_text: {
        fontSize: scaleByFactor(12),
      },

      empty_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
      },

      empty_text: {
        fontSize: scaleByFactor(16),
      },

      activity_indicator: {
        marginTop: scaleByFactor(16),
        flexDirection: 'row',
        alignItems: 'center',
      },

      highlighted: {
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<ImageListStyles> {
    return {
      header_container: {
        backgroundColor: config.styles.light.secondaryBackgroundColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      header_text: {
        color: config.styles.light.secondaryTextColor,
      },

      empty_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<ImageListStyles> {
    return {
      header_container: {
        backgroundColor: config.styles.dark.secondaryBackgroundColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      header_text: {
        color: config.styles.dark.secondaryTextColor,
      },

      empty_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const imageListResponsiveStyles = new ImageListResponsiveStyles();
