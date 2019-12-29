import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface OpenSourceProjectsScreenStyles {
  screen: ViewStyle;
  content_container: ViewStyle;
  paragraph: ViewStyle;
  text: TextStyle;
  bold: TextStyle;
  projects_container: ViewStyle;
  project_container: ViewStyle;
  project_title: TextStyle;
  project_description: TextStyle;
  button_container: ViewStyle;
}

export const baseStyles: OpenSourceProjectsScreenStyles = {
  screen: {
    flex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  content_container: {
    paddingVertical: 6,
  },

  paragraph: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  text: {
    fontSize: 15,
    lineHeight: 19,
  },

  bold: {
    fontWeight: 'bold',
  },

  projects_container: {
    marginTop: 10,
  },

  project_container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  project_title: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  project_description: {
    marginTop: 10,
    fontSize: 15,
  },

  button_container: {
    marginTop: 10,
    flexDirection: 'row',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    screen: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },
    text: {
      color: config.styles.light.primaryTextColor,
    },
    project_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },
    project_title: {
      color: config.styles.light.primaryTextColor,
    },
    project_description: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    screen: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },
    text: {
      color: config.styles.dark.primaryTextColor,
    },
    project_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },
    project_title: {
      color: config.styles.dark.primaryTextColor,
    },

    project_description: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
