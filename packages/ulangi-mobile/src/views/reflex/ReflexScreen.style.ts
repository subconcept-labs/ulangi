import * as _ from 'lodash';
import { StyleSheet, ViewStyle } from 'react-native';

import {
  darkStyles as defaultSelectedCategoriesDarkStyles,
  lightStyles as defaultSelectedCategoriesLightStyles,
} from '../category/SelectedCategories.style';

export interface ReflexScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  selected_categories_container: ViewStyle;
}

export const baseStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  selected_categories_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const lightStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const darkStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const selectedCategoriesLightStyles = StyleSheet.create(
  _.merge({}, defaultSelectedCategoriesLightStyles, {
    title: {
      color: '#fff',
    },
    category_name: {
      color: '#fff',
    },
  }),
);

export const selectedCategoriesDarkStyles = StyleSheet.create(
  _.merge({}, defaultSelectedCategoriesDarkStyles, {
    title: {
      color: '#fff',
    },
    category_name: {
      color: '#fff',
    },
  }),
);
