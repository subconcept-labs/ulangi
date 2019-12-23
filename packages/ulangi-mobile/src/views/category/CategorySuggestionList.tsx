/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, Theme } from '@ulangi/ulangi-common/enums';
import { IObservableArray, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { CategoryFormIds } from '../../constants/ids/CategoryFormIds';
import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { DefaultText } from '../common/DefaultText';
import { FixedTouchableWithoutFeedback } from '../common/FixedTouchableWithoutFeedback';
import {
  CategorySuggestionListStyles,
  darkStyles,
  lightStyles,
} from './CategorySuggestionList.style';

export interface CategorySuggestionListProps {
  theme: Theme;
  suggestions: null | IObservableArray<string>;
  fetchState: IObservableValue<ActivityState>;
  setCategoryName: (categoryName: string) => void;
  fetchMore: () => void;
  showAll: () => void;
  styles?: {
    light: CategorySuggestionListStyles;
    dark: CategorySuggestionListStyles;
  };
}

@observer
export class CategorySuggestionList extends React.Component<
  CategorySuggestionListProps
> {
  private keyExtractor = (item: any): string => item;

  public get styles(): CategorySuggestionListStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;

    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): null | React.ReactElement<any> {
    if (this.props.suggestions === null) {
      return null;
    } else {
      return (
        <FlatList
          data={this.props.suggestions}
          contentContainerStyle={this.styles.suggestion_list}
          keyExtractor={this.keyExtractor}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item: categoryName }): React.ReactElement<any> => {
            return (
              <FixedTouchableWithoutFeedback
                style={this.styles.suggestion_item}>
                <DefaultText style={this.styles.category_name}>
                  {categoryName}
                </DefaultText>
                <TouchableOpacity
                  testID={CategoryFormIds.USE_BTN_BY_CATEGORY_NAME(
                    categoryName,
                  )}
                  style={this.styles.use_btn}
                  onPress={(): void =>
                    this.props.setCategoryName(categoryName)
                  }>
                  <DefaultText style={this.styles.use_text}>
                    Use this
                  </DefaultText>
                </TouchableOpacity>
              </FixedTouchableWithoutFeedback>
            );
          }}
          onEndReachedThreshold={0.5}
          onEndReached={this.props.fetchMore}
          stickyHeaderIndices={[0]}
          ListEmptyComponent={this.renderEmptyComponent()}
          ListHeaderComponent={this.renderHeaderSection()}
          ListFooterComponent={
            <DefaultActivityIndicator
              activityState={this.props.fetchState}
              size="small"
              style={this.styles.activity_indicator}
            />
          }
        />
      );
    }
  }

  private renderEmptyComponent(): React.ReactElement<any> {
    return (
      <View style={this.styles.empty_container}>
        <DefaultText style={this.styles.empty_text}>
          No existing categories to select. You are entering a new category.
        </DefaultText>
      </View>
    );
  }

  private renderHeaderSection(): React.ReactElement<any> {
    return (
      <View style={this.styles.suggestion_title_container}>
        <DefaultText style={this.styles.suggestion_title}>
          EXISTING CATEGORIES:
        </DefaultText>
        <TouchableOpacity
          testID={CategoryFormIds.SHOW_ALL_BTN}
          onPress={this.props.showAll}
          style={this.styles.show_all_suggestions_btn}>
          <DefaultText style={this.styles.show_all_suggestions_text}>
            Show all
          </DefaultText>
        </TouchableOpacity>
      </View>
    );
  }
}
