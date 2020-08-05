import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';
import {
  darkStyles as defaultSectionRowDarkStyles,
  lightStyles as defaultSectionRowLightStyles,
} from '../section/SectionRow.style';

export interface FeatureManagementScreenStyles {
  screen: ViewStyle;
  message_container: ViewStyle;
  message: TextStyle;
}

const baseStyles: FeatureManagementScreenStyles = {
  screen: {
    flex: 1,
  },

  message_container: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    fontSize: ss(14),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    message: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    message: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);

export const sectionRowLightStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowLightStyles, {
    left_text: {
      fontSize: ss(16),
      fontWeight: 'bold',
    },
    inner_container: {
      backgroundColor: '#f0f0f0',
    },
  }),
);

export const sectionRowDarkStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowDarkStyles, {
    left_text: {
      fontSize: ss(16),
      fontWeight: 'bold',
    },
  }),
);
