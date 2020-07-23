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
import { FlatList, StyleSheet, View } from 'react-native';

import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { VocabularyItem } from '../vocabulary/VocabularyItem';

export interface VocabularyListProps {
  testID: string;
  theme: Theme;
  vocabularyListState: ObservableVocabularyListState;
  toggleSelection: (vocabularyId: string) => void;
  showVocabularyDetail: (vocabulary: ObservableVocabulary) => void;
  showVocabularyActionMenu: (vocabulary: ObservableVocabulary) => void;
  fetchNext: () => void;
  refresh: () => void;
}

@observer
export class VocabularyList extends React.Component<VocabularyListProps> {
  public keyExtractor = (item: any): string => item[0];

  public render(): React.ReactElement<any> {
    return (
      <View style={styles.list_container}>
        <FlatList
          testID={this.props.testID}
          contentContainerStyle={styles.list}
          data={
            this.props.vocabularyListState.vocabularyList
              ? Array.from(this.props.vocabularyListState.vocabularyList)
              : []
          }
          renderItem={({ item }): React.ReactElement<any> => {
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
                showVocabularyDetail={this.props.showVocabularyDetail}
                showVocabularyActionMenu={this.props.showVocabularyActionMenu}
              />
            );
          }}
          keyExtractor={this.keyExtractor}
          onEndReachedThreshold={0.5}
          onEndReached={(): void => this.props.fetchNext()}
          onRefresh={this.props.refresh}
          refreshing={this.props.vocabularyListState.isRefreshing.get()}
          ListFooterComponent={
            <DefaultActivityIndicator
              activityState={this.props.vocabularyListState.fetchState}
              isRefreshing={this.props.vocabularyListState.isRefreshing}
              size="small"
              style={styles.activity_indicator}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activity_indicator: {
    marginBottom: 16,
  },

  list_container: {
    flex: 1,
  },

  list: {
    paddingTop: 16,
    paddingBottom: 74,
  },
});
