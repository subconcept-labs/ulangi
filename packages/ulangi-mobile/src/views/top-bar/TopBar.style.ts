/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import {
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface TopBarStyles {
  top_bar_container: ViewStyle;
  button_container: ViewStyle;
  middle_container: ViewStyle;
  button: ViewStyle;
  left_button: ViewStyle;
  right_button: ViewStyle;
  button_text_container: ViewStyle;
  button_text: TextStyle;
  button_icon: ImageStyle;
  title: TextStyle;
  touchable: ViewStyle;
  touchable_text: TextStyle;
  touchable_icon: ImageStyle;
  touchable_caret: ImageStyle;
}

export const baseStyles: TopBarStyles = {
  top_bar_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button_container: {
    minWidth: ss(80),
    alignItems: 'center',
  },

  middle_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    justifyContent: 'center',
    flexDirection: 'row',
  },

  left_button: {
    alignSelf: 'flex-start',
    marginLeft: Platform.OS === 'ios' ? 8 : 16,
    marginRight: 16,
  },

  right_button: {
    alignSelf: 'flex-end',
    marginLeft: 16,
    marginRight: Platform.OS === 'ios' ? 8 : 16,
  },

  button_text_container: {
    height: 24,
    borderRadius: 24 / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button_text: {
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 15,
    //fontWeight: 'bold',
    letterSpacing: -0.5,
  },

  button_icon: {},

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    flexShrink: 1,
  },

  touchable: {
    flexShrink: 1,
    height: 32,
    borderRadius: 32 / 2,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  touchable_text: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    flexShrink: 1,
  },

  touchable_icon: {
    width: 22,
    height: 22,
  },

  touchable_caret: {
    marginRight: ss(4),
  },
};

export const lightStyles: TopBarStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: '#fff',
    },
    button_text_container: {
      backgroundColor: config.styles.primaryColor,
    },
    button_text: {
      color: '#fff',
    },
    touchable: {
      backgroundColor: '#eee',
    },
    touchable_text: {
      color: '#888',
    },
  }),
);

export const darkStyles: TopBarStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.dark.primaryTextColor,
    },
    button_text_container: {
      backgroundColor: config.styles.primaryColor,
    },
    button_text: {
      color: '#fff',
    },
    touchable: {
      backgroundColor: '#eee',
    },
    touchable_text: {
      color: '#888',
    },
  }),
);
