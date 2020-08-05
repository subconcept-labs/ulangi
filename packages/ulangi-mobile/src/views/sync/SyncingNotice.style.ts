/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SyncingNoticeStyles {
  container: ViewStyle;
  content_container: ViewStyle;
  icon: ImageStyle;
  text: TextStyle;
  dot: TextStyle;
  highlighted_text: TextStyle;
}

export class SyncingNoticeResponsiveStyles extends ResponsiveStyleSheet<
  SyncingNoticeStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SyncingNoticeStyles {
    return {
      container: {},

      content_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(10),
        height: scaleByFactor(30),
        borderRadius: scaleByFactor(15),
        backgroundColor: config.styles.primaryColor,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 1,
        shadowOpacity: 0.15,
        elevation: 3,
        marginBottom: scaleByFactor(-3),
      },

      icon: {},

      text: {
        marginLeft: scaleByFactor(4),
        textAlign: 'center',
        fontSize: scaleByFactor(13),
        color: '#fff',
      },

      dot: {
        fontWeight: '700',
      },

      highlighted_text: {
        fontWeight: '700',
      },
    };
  }

  public lightStyles(): Partial<SyncingNoticeStyles> {
    return {};
  }

  public darkStyles(): Partial<SyncingNoticeStyles> {
    return {};
  }
}

export const syncingNoticeResponsiveStyles = new SyncingNoticeResponsiveStyles();
