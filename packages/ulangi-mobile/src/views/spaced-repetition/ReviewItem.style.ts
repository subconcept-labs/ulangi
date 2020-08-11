/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';
import {
  DefinitionItemResponsiveStyles,
  DefinitionItemStyles,
} from '../vocabulary/DefinitionItem.style';

export interface ReviewItemStyles {
  vocabulary_container: ViewStyle;
  vocabulary_text_container: ViewStyle;
  vocabulary_text: TextStyle;
  top_container: ViewStyle;
  message_container: ViewStyle;
  message_inline: TextStyle;
  message_text_highlighted: TextStyle;
  definition_list_container: ViewStyle;
  bold: TextStyle;
}

export class ReviewItemResponsiveStyles extends ResponsiveStyleSheet<
  ReviewItemStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): ReviewItemStyles {
    return {
      vocabulary_container: {
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        backgroundColor: '#ececec',
        borderRadius: scaleByFactor(10),
        marginTop: scaleByFactor(20),
      },

      vocabulary_text_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(14),
      },

      top_container: {
        paddingVertical: scaleByFactor(3),
        flexDirection: 'row',
      },

      vocabulary_text: {
        fontSize: scaleByFactor(19),
        fontWeight: 'bold',
      },

      message_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
        borderTopWidth: scaleByFactor(2),
        flexDirection: 'row',
        alignItems: 'center',
      },

      message_inline: {
        flexShrink: 1,
        fontSize: scaleByFactor(15),
        lineHeight: scaleByFactor(19),
      },

      message_text_highlighted: {
        color: config.styles.primaryColor,
        fontSize: scaleByFactor(15),
        lineHeight: scaleByFactor(19),
      },

      bold: {
        fontWeight: 'bold',
      },

      definition_list_container: {
        borderTopWidth: 2,
      },
    };
  }

  public lightStyles(): Partial<ReviewItemStyles> {
    return {
      vocabulary_container: {
        backgroundColor: config.styles.light.secondaryBackgroundColor,
      },

      vocabulary_text: {
        color: config.styles.light.primaryTextColor,
      },

      message_container: {
        borderTopColor: config.styles.light.primaryBackgroundColor,
      },

      message_inline: {
        color: config.styles.light.secondaryTextColor,
      },

      definition_list_container: {
        borderTopColor: config.styles.light.secondaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<ReviewItemStyles> {
    return {
      vocabulary_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      vocabulary_text: {
        color: config.styles.dark.primaryTextColor,
      },

      message_container: {
        borderTopColor: config.styles.dark.secondaryBackgroundColor,
      },

      message_inline: {
        color: config.styles.dark.secondaryTextColor,
      },

      definition_list_container: {
        borderTopColor: config.styles.dark.secondaryBorderColor,
      },
    };
  }
}

export class ExtendedDefinitionItemResponsiveStyles extends DefinitionItemResponsiveStyles {
  public lightStyles(): Partial<DefinitionItemStyles> {
    return _.merge({}, super.lightStyles(), {
      item_container: {
        borderTopWidth: 1,
        borderTopColor: config.styles.light.primaryBackgroundColor,
      },
    });
  }

  public darkStyles(): Partial<DefinitionItemStyles> {
    return _.merge({}, super.lightStyles(), {
      item_container: {
        borderTopWidth: 1,
        borderTopColor: config.styles.dark.secondaryBackgroundColor,
      },
    });
  }
}

export const reviewItemResponsiveStyles = new ReviewItemResponsiveStyles();

export const definitionItemResponsiveStyles = new ExtendedDefinitionItemResponsiveStyles();
