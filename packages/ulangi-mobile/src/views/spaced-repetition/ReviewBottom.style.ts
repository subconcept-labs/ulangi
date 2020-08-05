import * as _ from 'lodash';
import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface ReviewBottomStyles {
  container: ViewStyle;
  horizontal_line: ViewStyle;
}

export const baseStyles: ReviewBottomStyles = {
  container: {},

  horizontal_line: {
    marginHorizontal: ss(8),
    height: StyleSheet.hairlineWidth,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    horizontal_line: {
      backgroundColor: config.styles.light.secondaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    horizontal_line: {
      backgroundColor: config.styles.dark.secondaryBorderColor,
    },
  }),
);
