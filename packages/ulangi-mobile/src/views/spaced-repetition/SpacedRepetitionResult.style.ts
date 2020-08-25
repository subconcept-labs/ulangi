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

export interface SpacedRepetitionResultStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  view_all_feedback_button_container: ViewStyle;
  save_text: TextStyle;
  ad_notice_container: ViewStyle;
  button_containers: ViewStyle;
  counts_container: ViewStyle;
  button_container: ViewStyle;
}

export class SpacedRepetitionResultResponsiveStyles extends ResponsiveStyleSheet<
  SpacedRepetitionResultStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): SpacedRepetitionResultStyles {
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

      view_all_feedback_button_container: {
        flexShrink: 1,
        flexDirection: 'row',
        justifyContent: 'center',
      },

      save_text: {
        fontSize: scaleByFactor(15),
        textAlign: 'center',
        paddingTop: scaleByFactor(6),
        lineHeight: scaleByFactor(19),
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

      counts_container: {
        marginBottom: scaleByFactor(10),
      },

      button_container: {
        marginVertical: scaleByFactor(6),
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },
    };
  }

  public lightStyles(): Partial<SpacedRepetitionResultStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },

      save_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SpacedRepetitionResultStyles> {
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

export const spacedRepetitionResultResponsiveStyles = new SpacedRepetitionResultResponsiveStyles();
