import * as _ from 'lodash';
import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';
import {
  SelectedCategoriesResponsiveStyles,
  SelectedCategoriesStyles,
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

export class AtomScreenResponsiveStyles extends ResponsiveStyleSheet<
  AtomScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AtomScreenStyles {
    return {
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
        marginTop: scaleByFactor(-100),
      },

      menu_container: {
        marginTop: scaleByFactor(20),
        alignSelf: 'stretch',
      },

      selected_categories_container: {
        marginTop: scaleByFactor(30),
      },

      bottom_container: {
        padding: scaleByFactor(16),
      },

      note: {
        fontSize: scaleByFactor(14),
        lineHeight: scaleByFactor(19),
        textAlign: 'center',
        color: '#1495bc',
      },
    };
  }

  public lightStyles(): Partial<AtomScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomScreenStyles> {
    return {};
  }
}

export class ExtendedSelectedCategoriesResponsiveStyles extends SelectedCategoriesResponsiveStyles {
  public baseStyles(scaleByFactor: ScaleByFactor): SelectedCategoriesStyles {
    return _.merge({}, super.baseStyles(scaleByFactor), {
      title: {
        color: config.atom.textColor,
      },
      category_name: {
        color: config.atom.textColor,
      },
    });
  }
}

export const atomScreenResponsiveStyles = new AtomScreenResponsiveStyles();
export const selectedCategoriesResponsiveStyles = new SelectedCategoriesResponsiveStyles();
