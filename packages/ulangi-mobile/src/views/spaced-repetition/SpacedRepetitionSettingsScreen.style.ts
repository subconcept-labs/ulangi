/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';
import {
  SectionRowResponsiveStyles,
  SectionRowStyles,
} from '../section/SectionRow.style';

export interface SpacedRepetitionSettingsScreenStyles {
  screen: ViewStyle;
  content_container: ViewStyle;
  description: TextStyle;
  touchable_text: TextStyle;
  bold: TextStyle;
}

export class SpacedRepetitionSettingsScreenResponsiveStyles extends ResponsiveStyleSheet<
  SpacedRepetitionSettingsScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): SpacedRepetitionSettingsScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      content_container: {
        paddingTop: scaleByFactor(16),
      },

      description: {
        fontSize: scaleByFactor(15),
        lineHeight: scaleByFactor(19),
      },

      touchable_text: {
        color: config.styles.primaryColor,
      },

      bold: {
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<SpacedRepetitionSettingsScreenStyles> {
    return {
      description: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SpacedRepetitionSettingsScreenStyles> {
    return {
      description: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export class ExtendedSectionRowResponsiveStyles extends SectionRowResponsiveStyles {
  public baseStyles(scaleByFactor: ScaleByFactor): SectionRowStyles {
    return _.merge({}, super.baseStyles(scaleByFactor), {
      left_text: {
        fontSize: scaleByFactor(16),
        fontWeight: 'bold',
      },
    });
  }

  public lightStyles(): Partial<SectionRowStyles> {
    return _.merge({}, super.lightStyles(), {
      inner_container: {
        backgroundColor: '#f0f0f0',
      },
    });
  }
}

export const spacedRepetitionSettingsScreenResponsiveStyles = new SpacedRepetitionSettingsScreenResponsiveStyles();

export const sectionRowResponsiveStyles = new ExtendedSectionRowResponsiveStyles();
