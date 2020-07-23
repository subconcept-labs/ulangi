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
  handleInputChange: (searchInput: string) => void;
  selectCategory: (categoryName: string) => void;
  fetchCategorySuggestions: () => void;
  clear: () => void;
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
              this.props.placeholderText || 'Enter category to search'
            }
            placeholderTextColor={
              this.props.theme === Theme.LIGHT
                ? config.styles.light.secondaryTextColor
                : config.styles.dark.secondaryTextColor
            }
            onChangeText={this.props.handleInputChange}
            style={this.styles.category_input}
            value={this.props.categoryFormState.searchInput}
          />
        </View>
        <CategorySuggestionList
          theme={this.props.theme}
          suggestions={this.props.categoryFormState.suggestions}
          fetchState={this.props.categoryFormState.fetchSuggestionsState}
          selectCategory={this.props.selectCategory}
          fetchMore={this.props.fetchCategorySuggestions}
          clear={this.props.clear}
        />
        <KeyboardSpacer />
      </View>
    );
  }
}
