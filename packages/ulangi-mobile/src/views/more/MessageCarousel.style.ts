/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../../utils/responsive';

export interface MessageCarouselStyles {
  item_container: ViewStyle;
  inner_container: ViewStyle;
  title: TextStyle;
  message: TextStyle;
  button_container: ViewStyle;
  pagination: ViewStyle;
}

export class MessageCarouselResponsiveStyles extends ResponsiveStyleSheet<
  MessageCarouselStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): MessageCarouselStyles {
    return {
      item_container: {
        paddingHorizontal: scaleByBreakpoints([16, 116, 216, 316]),
        paddingTop: scaleByFactor(16),
      },

      inner_container: {
        backgroundColor: '#777',
        borderRadius: scaleByFactor(4),
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(16),
      },

      title: {
        fontSize: scaleByFactor(13),
        fontWeight: 'bold',
        color: '#ffffff85',
      },

      message: {
        paddingTop: scaleByFactor(14),
        fontSize: scaleByFactor(15),
        color: '#fff',
      },

      button_container: {
        marginTop: scaleByFactor(16),
        marginBottom: scaleByFactor(2),
      },

      pagination: {
        paddingTop: scaleByFactor(20),
        paddingBottom: scaleByFactor(10),
      },
    };
  }

  public lightStyles(): Partial<MessageCarouselStyles> {
    return {};
  }

  public darkStyles(): Partial<MessageCarouselStyles> {
    return {};
  }
}

export const messageCarouselResponsiveStyles = new MessageCarouselResponsiveStyles();
