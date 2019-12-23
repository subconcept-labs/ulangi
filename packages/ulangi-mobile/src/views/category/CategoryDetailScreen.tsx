/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableCategoryDetailScreen,
  ObservableDarkModeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';

import { CategoryDetailScreenIds } from '../../constants/ids/CategoryDetailScreenIds';
import { CategoryDetailScreenDelegate } from '../../delegates/category/CategoryDetailScreenDelegate';
import { NoVocabulary } from '../vocabulary/NoVocabulary';
import { VocabularyBulkActionBar } from '../vocabulary/VocabularyBulkActionBar';
import { VocabularyList } from '../vocabulary/VocabularyList';
import { CategoryActionFloatingButton } from './CategoryActionFloatingButton';
import { CategoryDetailHeader } from './CategoryDetailHeader';
import {
  CategoryDetailScreenStyles,
  darkStyles,
  lightStyles,
} from './CategoryDetailScreen.style';

export interface CategoryDetailScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableCategoryDetailScreen;
  screenDelegate: CategoryDetailScreenDelegate;
}

@observer
export class CategoryDetailScreen extends React.Component<
  CategoryDetailScreenProps
> {
  public get styles(): CategoryDetailScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView
        style={this.styles.screen}
        testID={CategoryDetailScreenIds.SCREEN}>
        <CategoryDetailHeader
          theme={this.props.darkModeStore.theme}
          category={this.props.observableScreen.category}
          selectedFilterType={this.props.observableScreen.selectedFilterType}
          showVocabularyFilterMenu={
            this.props.screenDelegate.showVocabularyFilterMenu
          }
        />
        {this.renderVocabularyList()}
        {this.renderBulkActionBar()}
        {this.renderCategoryFloatingButton()}
      </SafeAreaView>
    );
  }

  private renderVocabularyList(): null | React.ReactElement<any> {
    if (
      this.props.observableScreen.vocabularyListState.vocabularyList !== null &&
      this.props.observableScreen.vocabularyListState.noMore === true &&
      this.props.observableScreen.vocabularyListState.vocabularyList.size === 0
    ) {
      return (
        <NoVocabulary
          selectedFilterType={this.props.observableScreen.selectedFilterType}
          refresh={this.props.screenDelegate.refreshCurrentList}
        />
      );
    } else if (
      this.props.observableScreen.vocabularyListState.vocabularyList !== null
    ) {
      return (
        <VocabularyList
          key={this.props.observableScreen.selectedFilterType.get()}
          testID={CategoryDetailScreenIds.VOCABULARY_LIST}
          theme={this.props.darkModeStore.theme}
          vocabularyListState={this.props.observableScreen.vocabularyListState}
          toggleSelection={this.props.screenDelegate.toggleSelection}
          showVocabularyDetail={this.props.screenDelegate.showVocabularyDetail}
          showVocabularyActionMenu={
            this.props.screenDelegate.showVocabularyActionMenu
          }
          fetchNext={this.props.screenDelegate.fetch}
          refresh={this.props.screenDelegate.refreshCurrentList}
          hideSyncingNotice={true}
        />
      );
    } else {
      return null;
    }
  }

  private renderBulkActionBar(): null | React.ReactElement<any> {
    if (
      this.props.observableScreen.vocabularyListState.isSelectionModeOn.get()
    ) {
      return (
        <VocabularyBulkActionBar
          vocabularyListState={this.props.observableScreen.vocabularyListState}
          showVocabularyBulkActionMenu={
            this.props.screenDelegate.showVocabularyBulkActionMenu
          }
          clearSelections={this.props.screenDelegate.clearSelections}
        />
      );
    } else {
      return null;
    }
  }

  private renderCategoryFloatingButton(): null | React.ReactElement<any> {
    if (
      this.props.observableScreen.vocabularyListState.isSelectionModeOn.get() ===
      false
    ) {
      return (
        <View style={this.styles.floating_button_container}>
          <CategoryActionFloatingButton
            showCategoryActionMenu={
              this.props.screenDelegate.showCategoryActionMenu
            }
          />
        </View>
      );
    } else {
      return null;
    }
  }
}
