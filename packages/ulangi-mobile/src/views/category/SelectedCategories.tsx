/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  SelectedCategoriesResponsiveStyles,
  SelectedCategoriesStyles,
  selectedCategoriesResponsiveStyles,
} from './SelectedCategories.style';

export interface SelectedCategoriesProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  selectedCategoryNames: undefined | IObservableArray<string>;
  showSelectSpecificCategoryMessage: () => void;
  styles?: SelectedCategoriesResponsiveStyles;
}

@observer
export class SelectedCategories extends React.Component<
  SelectedCategoriesProps
> {
  private get styles(): SelectedCategoriesStyles {
    return this.props.styles
      ? this.props.styles.compile(this.props.screenLayout, this.props.theme)
      : selectedCategoriesResponsiveStyles.compile(
          this.props.screenLayout,
          this.props.theme,
        );
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
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <DefaultText style={this.styles.title}>ALL CATEGORIES</DefaultText>
        </TouchableOpacity>
      );
    }
  }
}
