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
import { FlatList, View } from 'react-native';

import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { VocabularyItem } from '../vocabulary/VocabularyItem';
import {
  VocabularyListStyles,
  vocabularyListResponsiveStyles,
} from './VocabularyList.style';

export interface VocabularyListProps {
  testID: string;
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  vocabularyListState: ObservableVocabularyListState;
  toggleSelection: (vocabulary: ObservableVocabulary) => void;
  showVocabularyDetail: (vocabulary: ObservableVocabulary) => void;
  showVocabularyActionMenu: (vocabulary: ObservableVocabulary) => void;
  fetchNext: () => void;
  refresh: () => void;
}

@observer
export class VocabularyList extends React.Component<VocabularyListProps> {
  public keyExtractor = (item: any): string => item[0];

  private get styles(): VocabularyListStyles {
    return vocabularyListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.list_container}>
        <FlatList
          testID={this.props.testID}
          contentContainerStyle={this.styles.list}
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
                screenLayout={this.props.screenLayout}
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
              style={this.styles.activity_indicator}
            />
          }
        />
      </View>
    );
  }
}
