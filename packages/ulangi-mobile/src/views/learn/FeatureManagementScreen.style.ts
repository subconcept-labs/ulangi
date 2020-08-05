import * as _ from 'lodash';
import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';
import {
  SectionRowResponsiveStyles,
  SectionRowStyles,
} from '../section/SectionRow.style';

export interface FeatureManagementScreenStyles {
  screen: ViewStyle;
  message_container: ViewStyle;
  message: TextStyle;
}

export class FeatureManagementScreenResponsiveStyles extends ResponsiveStyleSheet<
  FeatureManagementScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): FeatureManagementScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      message_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      message: {
        fontSize: scaleByFactor(14),
      },
    };
  }

  public lightStyles(): Partial<FeatureManagementScreenStyles> {
    return {
      message: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<FeatureManagementScreenStyles> {
    return {
      message: {
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

export const featureManagementScreenResponsiveStyles = new FeatureManagementScreenResponsiveStyles();

export const sectionRowResponsiveStyles = new ExtendedSectionRowResponsiveStyles();
