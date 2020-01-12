/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ManageListType } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeStore,
  ObservableManageScreen,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { ManageScreenIds } from '../../constants/ids/ManageScreenIds';
import { ManageScreenDelegate } from '../../delegates/manage/ManageScreenDelegate';
import { CategoryBulkActionBar } from '../category/CategoryBulkActionBar';
import { CategoryList } from '../category/CategoryList';
import { SyncingNotice } from '../sync/SyncingNotice';
import { AddVocabularyFloatingButton } from '../vocabulary/AddVocabularyFloatingButton';
import { NoVocabulary } from '../vocabulary/NoVocabulary';
import { VocabularyBulkActionBar } from '../vocabulary/VocabularyBulkActionBar';
import { VocabularyList } from '../vocabulary/VocabularyList';
import { ManageBar } from './ManageBar';

export interface ManageScreenProps {
  setStore: ObservableSetStore;
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableManageScreen;
  screenDelegate: ManageScreenDelegate;
}

@observer
export class ManageScreen extends React.Component<ManageScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View testID={ManageScreenIds.SCREEN} style={styles.screen}>
        <ManageBar
          theme={this.props.darkModeStore.theme}
          manageListType={this.props.observableScreen.manageListType}
          selectedFilterType={this.props.observableScreen.selectedFilterType}
          showManageListSelectionMenu={
            this.props.screenDelegate.showManageListSelectionMenu
          }
          showVocabularyFilterMenu={
            this.props.screenDelegate.showVocabularyFilterMenu
          }
        />
        {this.props.observableScreen.manageListType.get() ===
        ManageListType.VOCABULARY_LIST
          ? this.renderVocabularyList()
          : this.renderCategoryList()}
        {this.renderBulkActionBar()}
        {this.renderSyncingNotice()}
        {this.renderFloatingActionButton()}
      </View>
    );
  }

  private renderVocabularyList(): React.ReactElement<any> {
    if (
      this.props.observableScreen.vocabularyListState.vocabularyList !== null &&
      this.props.observableScreen.vocabularyListState.noMore === true &&
      this.props.observableScreen.vocabularyListState.vocabularyList.size === 0
    ) {
      return (
        <NoVocabulary
          selectedFilterType={this.props.observableScreen.selectedFilterType}
          refresh={this.props.screenDelegate.refreshCurrentList}
          showQuickTutorial={this.props.screenDelegate.showQuickTutorial}
        />
      );
    } else {
      return (
        <VocabularyList
          key={this.props.observableScreen.selectedFilterType.get()}
          testID={ManageScreenIds.VOCABULARY_LIST}
          theme={this.props.darkModeStore.theme}
          vocabularyListState={this.props.observableScreen.vocabularyListState}
          toggleSelection={this.props.screenDelegate.toggleSelection}
          showVocabularyDetail={this.props.screenDelegate.showVocabularyDetail}
          showVocabularyActionMenu={
            this.props.screenDelegate.showVocabularyActionMenu
          }
          fetchNext={this.props.screenDelegate.fetch}
          refresh={this.props.screenDelegate.refreshCurrentList}
        />
      );
    }
  }

  private renderCategoryList(): React.ReactElement<any> {
    if (
      this.props.observableScreen.categoryListState.categoryList !== null &&
      this.props.observableScreen.categoryListState.noMore === true &&
      this.props.observableScreen.categoryListState.categoryList.size === 0
    ) {
      return (
        <NoVocabulary
          selectedFilterType={this.props.observableScreen.selectedFilterType}
          refresh={this.props.screenDelegate.refreshCurrentList}
          showQuickTutorial={this.props.screenDelegate.showQuickTutorial}
        />
      );
    } else {
      return (
        <CategoryList
          testID={ManageScreenIds.CATEGORY_LIST}
          theme={this.props.darkModeStore.theme}
          categoryListState={this.props.observableScreen.categoryListState}
          selectedFilterType={this.props.observableScreen.selectedFilterType}
          toggleSelection={this.props.screenDelegate.toggleSelection}
          showCategoryActionMenu={
            this.props.screenDelegate.showCategoryActionMenu
          }
          showCategoryDetail={this.props.screenDelegate.showCategoryDetail}
          fetchNext={this.props.screenDelegate.fetch}
          refresh={this.props.screenDelegate.refreshCurrentList}
          goToSpacedRepetition={this.props.screenDelegate.goToSpacedRepetition}
          goToWriting={this.props.screenDelegate.goToWriting}
          showLevelBreakdownForSR={
            this.props.screenDelegate.showLevelBreakdownForSR
          }
          showLevelBreakdownForWR={
            this.props.screenDelegate.showLevelBreakdownForWR
          }
        />
      );
    }
  }

  private renderBulkActionBar(): null | React.ReactElement<any> {
    if (this.shouldShowVocabularyBulkActionBar()) {
      return (
        <View style={styles.bulk_action_bar_container}>
          <VocabularyBulkActionBar
            vocabularyListState={
              this.props.observableScreen.vocabularyListState
            }
            showVocabularyBulkActionMenu={
              this.props.screenDelegate.showVocabularyBulkActionMenu
            }
            clearSelections={this.props.screenDelegate.clearSelections}
          />
        </View>
      );
    } else if (this.shouldShowCategoryBulkActionBar()) {
      return (
        <View style={styles.bulk_action_bar_container}>
          <CategoryBulkActionBar
            categoryListState={this.props.observableScreen.categoryListState}
            showCategoryBulkActionMenu={
              this.props.screenDelegate.showCategoryBulkActionMenu
            }
            clearSelections={this.props.screenDelegate.clearSelections}
          />
        </View>
      );
    } else {
      return null;
    }
  }

  private renderFloatingActionButton(): null | React.ReactElement<any> {
    if (
      !this.shouldShowVocabularyBulkActionBar() &&
      !this.shouldShowCategoryBulkActionBar()
    ) {
      return (
        <View style={styles.floating_action_button}>
          <AddVocabularyFloatingButton
            addVocabulary={this.props.screenDelegate.goToAddVocabulary}
          />
        </View>
      );
    } else {
      return null;
    }
  }

  private renderSyncingNotice(): null | React.ReactElement<any> {
    if (
      !this.shouldShowVocabularyBulkActionBar() &&
      !this.shouldShowCategoryBulkActionBar()
    ) {
      return (
        <View style={styles.syncing_notice}>
          <SyncingNotice
            shouldShowSyncingNotice={
              this.props.observableScreen.manageListType.get() ===
              ManageListType.CATEGORY_LIST
                ? this.props.observableScreen.categoryListState
                    .shouldShowSyncingNotice
                : this.props.observableScreen.vocabularyListState
                    .shouldShowSyncingNotice
            }
            shouldShowRefreshNotice={
              this.props.observableScreen.manageListType.get() ===
              ManageListType.CATEGORY_LIST
                ? this.props.observableScreen.categoryListState
                    .shouldShowRefreshNotice
                : this.props.observableScreen.vocabularyListState
                    .shouldShowRefreshNotice
            }
            refresh={this.props.screenDelegate.refreshCurrentList}
          />
        </View>
      );
    } else {
      return null;
    }
  }
  private shouldShowVocabularyBulkActionBar(): boolean {
    return (
      this.props.observableScreen.manageListType.get() ===
        ManageListType.VOCABULARY_LIST &&
      this.props.observableScreen.vocabularyListState.isSelectionModeOn.get() ===
        true
    );
  }

  private shouldShowCategoryBulkActionBar(): boolean {
    return (
      this.props.observableScreen.manageListType.get() ===
        ManageListType.CATEGORY_LIST &&
      this.props.observableScreen.categoryListState.isSelectionModeOn.get() ===
        true
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  bulk_action_bar_container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },

  floating_action_button: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },

  syncing_notice: {
    position: 'absolute',
    left: (Dimensions.get('window').width - 120) / 2,
    bottom: 16,
    width: 120,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
