import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface SuggestionItemStyles {
  item_container: ViewStyle;
  text: TextStyle;
  importance: TextStyle;
  dot: TextStyle;
  message: TextStyle;
  button_list: ViewStyle;
  button: ViewStyle;
  button_text: TextStyle;
}

export const baseStyles: SuggestionItemStyles = {
  item_container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  text: {},

  importance: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    textAlignVertical: 'center',
  },

  dot: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  message: {
    fontSize: 16,
  },

  button_list: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  button: {
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginHorizontal: 4,
    marginVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.75,
    shadowOpacity: 0.15,
    elevation: 0.75,
  },

  button_text: {
    fontSize: 15,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    importance: {
      color: config.styles.light.secondaryTextColor,
    },

    dot: {
      color: config.styles.light.secondaryTextColor,
    },

    message: {
      color: config.styles.light.primaryTextColor,
    },

    button: {
      borderColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    button_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    importance: {
      color: config.styles.dark.secondaryTextColor,
    },

    dot: {
      color: config.styles.dark.secondaryTextColor,
    },

    message: {
      color: config.styles.dark.primaryTextColor,
    },

    button: {
      borderColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    button_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
