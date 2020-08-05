import * as _ from 'lodash';
import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';
import {
  SelectedCategoriesResponsiveStyles,
  SelectedCategoriesStyles,
} from '../category/SelectedCategories.style';

export interface ReflexScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  selected_categories_container: ViewStyle;
}

export class ReflexScreenResponsiveStyles extends ResponsiveStyleSheet<
  ReflexScreenStyles
> {
  public baseStyles(): ReflexScreenStyles {
    return {
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
    };
  }

  public lightStyles(): Partial<ReflexScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<ReflexScreenStyles> {
    return {};
  }
}

export class ExtendedSelectedCategoriesResponsiveStyles extends SelectedCategoriesResponsiveStyles {
  public lightStyles(): Partial<SelectedCategoriesStyles> {
    return _.merge({}, super.lightStyles(), {
      title: {
        color: '#fff',
      },
      category_name: {
        color: '#fff',
      },
    });
  }

  public darkStyles(): Partial<SelectedCategoriesStyles> {
    return _.merge({}, super.darkStyles(), {
      title: {
        color: '#fff',
      },
      category_name: {
        color: '#fff',
      },
    });
  }
}

export const selectedCategoriesResponsiveStyles = new ExtendedSelectedCategoriesResponsiveStyles();

export const reflexScreenResponsiveStyles = new ReflexScreenResponsiveStyles();
