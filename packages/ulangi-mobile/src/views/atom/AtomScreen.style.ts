import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';
import {
  darkStyles as defaultSelectedCategoriesDarkStyles,
  lightStyles as defaultSelectedCategoriesLightStyles,
} from '../category/SelectedCategories.style';

export interface AtomScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  top_bar_container: ViewStyle;
  middle_container: ViewStyle;
  title_container: ViewStyle;
  menu_container: ViewStyle;
  selected_categories_container: ViewStyle;
  bottom_container: ViewStyle;
  note: TextStyle;
}

export const baseStyles: AtomScreenStyles = {
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  top_bar_container: {},

  middle_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title_container: {
    alignSelf: 'stretch',
    marginTop: ss(-100),
  },

  menu_container: {
    marginTop: ss(20),
    alignSelf: 'stretch',
  },

  selected_categories_container: {
    marginTop: ss(30),
  },

  bottom_container: {
    padding: ss(16),
  },

  note: {
    fontSize: ss(14),
    lineHeight: ss(19),
    textAlign: 'center',
    color: '#1495bc',
  },
};

export const lightStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const darkStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const selectedCategoriesLightStyles = StyleSheet.create(
  _.merge({}, defaultSelectedCategoriesLightStyles, {
    title: {
      color: config.atom.textColor,
    },
    category_name: {
      color: config.atom.textColor,
    },
  }),
);

export const selectedCategoriesDarkStyles = StyleSheet.create(
  _.merge({}, defaultSelectedCategoriesDarkStyles, {
    title: {
      color: config.atom.textColor,
    },
    category_name: {
      color: config.atom.textColor,
    },
  }),
);
