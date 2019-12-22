/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  SelectedCategoriesStyles,
  darkStyles,
  lightStyles,
} from './SelectedCategories.style';

export interface SelectedCategoriesProps {
  theme: Theme;
  selectedCategoryNames: undefined | IObservableArray<string>;
  showSelectSpecificCategoryMessage: () => void;
  styles?: {
    light: SelectedCategoriesStyles;
    dark: SelectedCategoriesStyles;
  };
}

@observer
export class SelectedCategories extends React.Component<
  SelectedCategoriesProps
> {
  private get styles(): SelectedCategoriesStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return <View style={this.styles.container}>{this.renderContent()}</View>;
  }

  private renderContent(): React.ReactElement<any> {
    if (typeof this.props.selectedCategoryNames !== 'undefined') {
      return (
        <React.Fragment>
          <DefaultText style={this.styles.title}>
            SELECTED CATEGORIES
          </DefaultText>
          <View style={this.styles.category_name_list_container}>
            <DefaultText style={this.styles.category_name} numberOfLines={1}>
              {this.props.selectedCategoryNames.join('   ')}
            </DefaultText>
          </View>
        </React.Fragment>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={this.props.showSelectSpecificCategoryMessage}
          style={this.styles.title_container}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <DefaultText style={this.styles.title}>ALL CATEGORIES</DefaultText>
        </TouchableOpacity>
      );
    }
  }
}
