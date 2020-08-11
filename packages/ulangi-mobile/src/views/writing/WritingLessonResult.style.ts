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

export interface WritingLessonResultStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  save_text: TextStyle;
  view_all_feedback_button_container: ViewStyle;
  ad_notice_container: ViewStyle;
  button_containers: ViewStyle;
  button_container: ViewStyle;
}

export class WritingLessonResultResponsiveStyles extends ResponsiveStyleSheet<
  WritingLessonResultStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): WritingLessonResultStyles {
    return {
      container: {
        flex: 1,
      },

      title_container: {
        marginTop: scaleByFactor(20),
        flexDirection: 'row',
        justifyContent: 'center',
      },

      title: {
        fontSize: scaleByFactor(15),
        fontWeight: 'bold',
      },

      save_text: {
        fontSize: scaleByFactor(15),
        textAlign: 'center',
        paddingTop: scaleByFactor(6),
      },

      view_all_feedback_button_container: {
        flexShrink: 1,
        flexDirection: 'row',
        justifyContent: 'center',
      },

      ad_notice_container: {
        marginTop: scaleByFactor(16),
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },

      button_containers: {
        marginTop: scaleByFactor(16),
      },

      button_container: {
        marginVertical: scaleByFactor(6),
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },
    };
  }

  public lightStyles(): Partial<WritingLessonResultStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },

      save_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<WritingLessonResultStyles> {
    return {
      title: {
        color: config.styles.dark.primaryTextColor,
      },

      save_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const writingLessonResultResponsiveStyles = new WritingLessonResultResponsiveStyles();
