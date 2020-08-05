/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface FAQListStyles {
  container: ViewStyle;
  scroll_view: ViewStyle;
  section_container: ViewStyle;
  header_container: ViewStyle;
  title_container: ViewStyle;
  title_text: TextStyle;
  content_container: ViewStyle;
  content_text: TextStyle;
  index_container: ViewStyle;
  index: TextStyle;
}

export class FAQListResponsiveStyles extends ResponsiveStyleSheet<
  FAQListStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): FAQListStyles {
    return {
      container: {
        flex: 1,
      },

      scroll_view: {
        paddingVertical: scaleByFactor(8),
      },

      section_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(10),
      },

      header_container: {
        flexDirection: 'row',
        paddingVertical: scaleByFactor(4),
        alignItems: 'center',
      },

      title_container: {
        flexShrink: 1,
      },

      title_text: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(16),
      },

      content_container: {
        marginLeft: scaleByFactor(11),
        paddingHorizontal: scaleByFactor(16),
        borderLeftWidth: StyleSheet.hairlineWidth,
      },

      content_text: {
        fontSize: scaleByFactor(15),
        lineHeight: scaleByFactor(20),
      },

      index_container: {
        width: scaleByFactor(22),
        height: scaleByFactor(22),
        borderRadius: scaleByFactor(22) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scaleByFactor(5),
      },

      index: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(13),
      },
    };
  }

  public lightStyles(): Partial<FAQListStyles> {
    return {
      title_text: {
        color: config.styles.light.secondaryTextColor,
      },

      content_container: {
        borderLeftColor: config.styles.light.secondaryBackgroundColor,
      },

      content_text: {
        color: config.styles.light.primaryTextColor,
      },

      index_container: {
        backgroundColor: config.styles.light.secondaryTextColor,
      },

      index: {
        color: config.styles.light.primaryBackgroundColor,
      },
    };
  }

  public darkStyles(): Partial<FAQListStyles> {
    return {
      title_text: {
        color: config.styles.dark.secondaryTextColor,
      },

      content_container: {
        borderLeftColor: config.styles.dark.secondaryBackgroundColor,
      },

      content_text: {
        color: config.styles.dark.primaryTextColor,
      },

      index_container: {
        backgroundColor: config.styles.dark.secondaryTextColor,
      },

      index: {
        color: config.styles.dark.primaryBackgroundColor,
      },
    };
  }
}

export const faqListResponsiveStyles = new FAQListResponsiveStyles();
