/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableDarkModeStore,
  ObservableSearchScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { SearchScreenIds } from '../../constants/ids/SearchScreenIds';
import { SearchScreenDelegate } from '../../delegates/search/SearchScreenDelegate';
import { VocabularyBulkActionBar } from '../vocabulary/VocabularyBulkActionBar';
import { SearchBar } from './SearchBar';
import { SearchList } from './SearchList';

export interface SearchScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableSearchScreen;
  screenDelegate: SearchScreenDelegate;
}

@observer
export class SearchScreen extends React.Component<SearchScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView style={styles.screen} testID={SearchScreenIds.SCREEN}>
        <SearchBar
          theme={this.props.darkModeStore.theme}
          observableScreen={this.props.observableScreen}
          handleSearchInputEnd={this.props.screenDelegate.handleSearchInputEnd}
        />
        <SearchList
          theme={this.props.darkModeStore.theme}
          vocabularyListState={this.props.observableScreen.vocabularyListState}
          search={this.props.screenDelegate.search}
          refresh={this.props.screenDelegate.refreshCurrentList}
          toggleSelection={this.props.screenDelegate.toggleSelection}
          showVocabularyDetail={this.props.screenDelegate.showVocabularyDetail}
          showVocabularyActionMenu={
            this.props.screenDelegate.showVocabularyActionMenu
          }
        />
        {this.props.observableScreen.vocabularyListState.isSelectionModeOn.get() ? (
          <VocabularyBulkActionBar
            vocabularyListState={
              this.props.observableScreen.vocabularyListState
            }
            showVocabularyBulkActionMenu={
              this.props.screenDelegate.showVocabularyBulkActionMenu
            }
            clearSelections={this.props.screenDelegate.clearSelections}
          />
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between', // this make bulk action bar stick to bottom
  },
});
