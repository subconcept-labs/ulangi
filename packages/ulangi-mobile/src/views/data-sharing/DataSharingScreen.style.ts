import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DataSharingScreenStyles {
  screen: ViewStyle;
  title: TextStyle;
  paragraph: TextStyle;
  button_container: ViewStyle;
}

export const baseStyles: DataSharingScreenStyles = {
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    marginVertical: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },

  paragraph: {
    paddingTop: 8,
    fontSize: 15,
  },

  button_container: {
    marginTop: 24,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.light.primaryTextColor,
    },
    paragraph: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.dark.primaryTextColor,
    },
    paragraph: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
