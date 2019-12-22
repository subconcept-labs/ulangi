/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableVocabulary,
  ObservableVocabularyListState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { SearchScreenIds } from '../../constants/ids/SearchScreenIds';
import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { DefaultText } from '../common/DefaultText';
import { SynchronizableListHeader } from '../common/SynchronizableListHeader';
import { VocabularyItem } from '../vocabulary/VocabularyItem';

export interface SearchListProps {
  theme: Theme;
  vocabularyListState: ObservableVocabularyListState;
  search: () => void;
  refresh: () => void;
  toggleSelection: (vocabularyId: string) => void;
  showVocabularyDetail: (vocabulary: ObservableVocabulary) => void;
  showVocabularyActionMenu: (vocabulary: ObservableVocabulary) => void;
}

@observer
export class SearchList extends React.Component<SearchListProps> {
  public keyExtractor = (item: [string, ObservableVocabulary]): string =>
    item[0];

  public render(): React.ReactElement<any> {
    if (
      this.props.vocabularyListState.vocabularyList !== null &&
      this.props.vocabularyListState.vocabularyList.size === 0 &&
      this.props.vocabularyListState.noMore === true
    ) {
      return (
        <ScrollView
          testID={SearchScreenIds.NO_RESULTS}
          contentContainerStyle={styles.no_results_container}
        >
          <DefaultText style={styles.no_results_text}>
            Oops! No results found in this set.
          </DefaultText>
        </ScrollView>
      );
    }
    if (this.props.vocabularyListState.vocabularyList === null) {
      return (
        <ScrollView contentContainerStyle={styles.tip_container}>
          <DefaultActivityIndicator
            activityState={this.props.vocabularyListState.fetchState}
            style={styles.center_activity_indicator}
            size="small"
          />
          <View>
            <DefaultText style={styles.tip}>
              Tip: You can search by definition and/or prefix of the word.
            </DefaultText>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.list_container}>
          <FlatList
            testID={SearchScreenIds.SEARCH_LIST}
            contentContainerStyle={styles.list}
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
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <SynchronizableListHeader
                shouldShowSyncingNotice={
                  this.props.vocabularyListState.shouldShowSyncingNotice
                }
                shouldShowSyncCompletedNotice={
                  this.props.vocabularyListState.shouldShowSyncCompletedNotice
                }
                refresh={this.props.refresh}
              />
            }
            ListFooterComponent={
              <DefaultActivityIndicator
                activityState={this.props.vocabularyListState.fetchState}
                isRefreshing={this.props.vocabularyListState.isRefreshing}
                size="small"
                style={styles.bottom_activity_indicator}
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

const styles = StyleSheet.create({
  no_results_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -100,
  },

  no_results_text: {
    fontSize: 15,
    color: '#999',
    paddingHorizontal: 16,
    textAlign: 'center',
  },

  tip_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -100,
  },

  tip: {
    fontSize: 15,
    color: '#999',
    paddingHorizontal: 16,
    textAlign: 'center',
    lineHeight: 19,
  },

  center_activity_indicator: {
    marginVertical: 8,
  },

  bottom_activity_indicator: {
    marginTop: 16,
  },

  list_container: {
    flex: 1,
  },

  list: {
    paddingTop: 16,
  },
});
