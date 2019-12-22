/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableCategoryFormState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TextInput, View } from 'react-native';

import { config } from '../../constants/config';
import { CategoryFormIds } from '../../constants/ids/CategoryFormIds';
import { CategorySuggestionList } from '../category/CategorySuggestionList';
import { KeyboardSpacer } from '../common/KeyboardSpacer';
import {
  CategoryFormStyles,
  darkStyles,
  lightStyles,
} from './CategoryForm.style';

export interface CategoryFormProps {
  theme: Theme;
  placeholderText?: string;
  categoryFormState: ObservableCategoryFormState;
  setCategoryName: (categoryName: string) => void;
  fetchCategorySuggestions: () => void;
  showAllCategories: () => void;
  styles?: {
    light: CategoryFormStyles;
    dark: CategoryFormStyles;
  };
}

@observer
export class CategoryForm extends React.Component<CategoryFormProps> {
  public get styles(): CategoryFormStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.category_input_container}>
          <TextInput
            testID={CategoryFormIds.CATEGORY_INPUT}
            placeholder={
              this.props.placeholderText ||
              'Select or enter category of the term'
            }
            placeholderTextColor={
              this.props.theme === Theme.LIGHT
                ? config.styles.light.secondaryTextColor
                : config.styles.dark.secondaryTextColor
            }
            onChangeText={this.props.setCategoryName}
            style={this.styles.category_input}
            value={this.props.categoryFormState.categoryName}
          />
        </View>
        <CategorySuggestionList
          theme={this.props.theme}
          suggestions={this.props.categoryFormState.suggestions}
          fetchState={this.props.categoryFormState.fetchSuggestionsState}
          setCategoryName={this.props.setCategoryName}
          fetchMore={this.props.fetchCategorySuggestions}
          showAll={this.props.showAllCategories}
        />
        <KeyboardSpacer />
      </View>
    );
  }
}
