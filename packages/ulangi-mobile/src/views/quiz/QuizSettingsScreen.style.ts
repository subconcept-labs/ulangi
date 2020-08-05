/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';
import {
  SectionRowResponsiveStyles,
  SectionRowStyles,
} from '../section/SectionRow.style';

export interface QuizSettingsScreenStyles {
  screen: ViewStyle;
  content_container: ViewStyle;
}

export class QuizSettingsScreenResponsiveStyles extends ResponsiveStyleSheet<
  QuizSettingsScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): QuizSettingsScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      content_container: {
        paddingTop: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<QuizSettingsScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<QuizSettingsScreenStyles> {
    return {};
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

export const sectionRowResponsiveStyles = new ExtendedSectionRowResponsiveStyles();

export const quizSettingsScreenResponsiveStyles = new QuizSettingsScreenResponsiveStyles();
