/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableVocabulary,
  ObservableVocabularyListState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList, ScrollView, View } from 'react-native';

import { SearchScreenIds } from '../../constants/ids/SearchScreenIds';
import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { DefaultText } from '../common/DefaultText';
import { VocabularyItem } from '../vocabulary/VocabularyItem';
import {
  SearchListStyles,
  searchListResponsiveStyles,
} from './SearchList.style';

export interface SearchListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  vocabularyListState: ObservableVocabularyListState;
  search: () => void;
  refresh: () => void;
  toggleSelection: (vocabulary: ObservableVocabulary) => void;
  showVocabularyDetail: (vocabulary: ObservableVocabulary) => void;
  showVocabularyActionMenu: (vocabulary: ObservableVocabulary) => void;
}

@observer
export class SearchList extends React.Component<SearchListProps> {
  public keyExtractor = (item: [string, ObservableVocabulary]): string =>
    item[0];

  private get styles(): SearchListStyles {
    return searchListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    if (
      this.props.vocabularyListState.vocabularyList !== null &&
      this.props.vocabularyListState.vocabularyList.size === 0 &&
      this.props.vocabularyListState.noMore === true
    ) {
      return (
        <ScrollView
          testID={SearchScreenIds.NO_RESULTS}
          contentContainerStyle={this.styles.no_results_container}>
          <DefaultText style={this.styles.no_results_text}>
            Oops! No results found in this set.
          </DefaultText>
        </ScrollView>
      );
    }
    if (this.props.vocabularyListState.vocabularyList === null) {
      return (
        <ScrollView contentContainerStyle={this.styles.tip_container}>
          <DefaultActivityIndicator
            activityState={this.props.vocabularyListState.fetchState}
            style={this.styles.center_activity_indicator}
            size="small"
          />
          <View>
            <DefaultText style={this.styles.tip}>
              Tip: You can search by definition and/or prefix of the word.
            </DefaultText>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View style={this.styles.list_container}>
          <FlatList
            testID={SearchScreenIds.SEARCH_LIST}
            contentContainerStyle={this.styles.list}
            data={
              this.props.vocabularyListState.vocabularyList
                ? Array.from(this.props.vocabularyListState.vocabularyList)
                : []
            }
            renderItem={({
              item,
            }: {
              item: [string, ObservableVocabulary];
            }): React.ReactElement<any> => {
              const [, vocabulary] = item;
              return (
                <VocabularyItem
                  theme={this.props.theme}
                  screenLayout={this.props.screenLayout}
                  vocabulary={vocabulary}
                  shouldShowTags={true}
                  isSelectionModeOn={
                    this.props.vocabularyListState.isSelectionModeOn
                  }
                  toggleSelection={this.props.toggleSelection}
                  showVocabularyDetail={(): void =>
                    this.props.showVocabularyDetail(item[1])
                  }
                  showVocabularyActionMenu={this.props.showVocabularyActionMenu}
                />
              );
            }}
            keyExtractor={this.keyExtractor}
            onEndReachedThreshold={0.5}
            onEndReached={this.props.search}
            ListFooterComponent={
              <DefaultActivityIndicator
                activityState={this.props.vocabularyListState.fetchState}
                isRefreshing={this.props.vocabularyListState.isRefreshing}
                size="small"
                style={this.styles.bottom_activity_indicator}
              />
            }
            onRefresh={(): void => this.props.refresh()}
            refreshing={this.props.vocabularyListState.isRefreshing.get()}
          />
        </View>
      );
    }
  }
}
