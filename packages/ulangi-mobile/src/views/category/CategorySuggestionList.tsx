/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { CategorySuggestion } from '@ulangi/ulangi-common/interfaces';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { IObservableArray, IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { CategoryFormIds } from '../../constants/ids/CategoryFormIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { FixedTouchableWithoutFeedback } from '../common/FixedTouchableWithoutFeedback';
import {
  CategorySuggestionListStyles,
  categorySuggestionListResponsiveStyles,
} from './CategorySuggestionList.style';

export interface CategorySuggestionListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  suggestions: null | IObservableArray<CategorySuggestion>;
  fetchState: IObservableValue<ActivityState>;
  selectCategory: (categoryName: string) => void;
  fetchMore: () => void;
  clear: () => void;
}

@observer
export class CategorySuggestionList extends React.Component<
  CategorySuggestionListProps
> {
  private keyExtractor = (item: CategorySuggestion): string =>
    item.categoryName;

  private get styles(): CategorySuggestionListStyles {
    return categorySuggestionListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    return (
      <FlatList
        data={this.props.suggestions || []}
        contentContainerStyle={this.styles.suggestion_list}
        keyExtractor={this.keyExtractor}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item: suggestion }): React.ReactElement<any> => {
          return (
            <FixedTouchableWithoutFeedback style={this.styles.suggestion_item}>
              <View style={this.styles.left}>
                <DefaultText style={this.styles.category_name}>
                  {suggestion.categoryName}
                </DefaultText>
                <DefaultText
                  style={[
                    this.styles.category_meta,
                    suggestion.kind === 'new' ? this.styles.new_category : null,
                  ]}>
                  {suggestion.kind === 'new' ? 'New' : 'Existing'}
                </DefaultText>
              </View>
              <DefaultButton
                text="Select"
                styles={fullRoundedButtonStyles.getSolidPrimaryBackgroundStyles(
                  ButtonSize.SMALL,
                  this.props.theme,
                  this.props.screenLayout,
                )}
                cancelPressOnMove={true}
                onPress={(): void =>
                  this.props.selectCategory(suggestion.categoryName)
                }
              />
            </FixedTouchableWithoutFeedback>
          );
        }}
        onEndReachedThreshold={0.5}
        onEndReached={this.props.fetchMore}
        stickyHeaderIndices={[0]}
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

  private renderHeaderSection(): React.ReactElement<any> {
    return (
      <View style={this.styles.suggestion_title_container}>
        <DefaultText style={this.styles.suggestion_title}>
          CATEGORIES:
        </DefaultText>
        <TouchableOpacity
          testID={CategoryFormIds.SHOW_ALL_BTN}
          onPress={this.props.clear}
          style={this.styles.show_all_suggestions_btn}>
          <DefaultText style={this.styles.show_all_suggestions_text}>
            Clear
          </DefaultText>
        </TouchableOpacity>
      </View>
    );
  }
}
