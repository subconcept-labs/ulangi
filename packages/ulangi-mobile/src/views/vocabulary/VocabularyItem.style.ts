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

export interface VocabularyItemStyles {
  item_container: ViewStyle;
  vocabulary_container: ViewStyle;
  top_container: ViewStyle;
  term_container: ViewStyle;
  tag_list: ViewStyle;
  tag_container: ViewStyle;
  tag_text: TextStyle;
  dot_container: ViewStyle;
  dot: TextStyle;
  term: TextStyle;
  missing_term: TextStyle;
  option_btn: ViewStyle;
  definition_list_container: ViewStyle;
  highlighted: TextStyle;
}

export class VocabularyItemResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyItemStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): VocabularyItemStyles {
    return {
      item_container: {
        marginBottom: scaleByFactor(16),
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        borderRadius: scaleByFactor(5),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.3 },
        shadowRadius: 0.75,
        shadowOpacity: 0.25,
      },

      vocabulary_container: {
        paddingVertical: scaleByFactor(12),
        paddingHorizontal: scaleByFactor(16),
      },

      top_container: {
        paddingVertical: scaleByFactor(2),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      },

      term_container: {
        flexShrink: 1,
        //flexDirection: "row",
        //alignItems: "center"
      },

      tag_list: {
        flexDirection: 'row',
      },

      tag_container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      tag_text: {
        fontSize: scaleByFactor(12),
      },

      dot_container: {
        paddingHorizontal: scaleByFactor(6),
      },

      dot: {
        fontSize: scaleByFactor(17),
      },

      term: {
        fontSize: scaleByFactor(19),
        fontWeight: 'bold',
      },

      missing_term: {
        fontSize: scaleByFactor(16),
        fontStyle: 'italic',
      },

      option_btn: {
        paddingLeft: scaleByFactor(5),
        justifyContent: 'center',
        alignItems: 'center',
      },

      definition_list_container: {
        borderTopWidth: scaleByFactor(2),
      },

      highlighted: {
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<VocabularyItemStyles> {
    return {
      item_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        elevation: 1,
      },
      term: {
        color: config.styles.light.primaryTextColor,
      },

      tag_text: {
        color: config.styles.light.secondaryTextColor,
      },

      dot: {
        color: config.styles.light.secondaryTextColor,
      },

      missing_term: {
        color: config.styles.light.secondaryTextColor,
      },

      definition_list_container: {
        borderTopColor: config.styles.light.secondaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<VocabularyItemStyles> {
    return {
      item_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        elevation: 3,
      },

      term: {
        color: config.styles.dark.primaryTextColor,
      },

      tag_text: {
        color: config.styles.dark.secondaryTextColor,
      },

      dot: {
        color: config.styles.dark.secondaryTextColor,
      },

      missing_term: {
        color: config.styles.dark.secondaryTextColor,
      },

      definition_list_container: {
        borderTopColor: config.styles.dark.secondaryBorderColor,
      },
    };
  }
}

export const vocabularyItemResponsiveStyles = new VocabularyItemResponsiveStyles();
