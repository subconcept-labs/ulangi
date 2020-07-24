/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme, VocabularyFilterType } from '@ulangi/ulangi-common/enums';
import {
  ObservableManageScreen,
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { ManageScreenIds } from '../../constants/ids/ManageScreenIds';
import { ManageScreenDelegate } from '../../delegates/manage/ManageScreenDelegate';
import { CategoryBulkActionBar } from '../category/CategoryBulkActionBar';
import { CategoryList } from '../category/CategoryList';
import { SyncingNotice } from '../sync/SyncingNotice';
import { AddVocabularyFloatingButton } from '../vocabulary/AddVocabularyFloatingButton';
import { NoVocabulary } from '../vocabulary/NoVocabulary';
import { ManageBar } from './ManageBar';
import {
  ManageScreenStyles,
  darkStyles,
  lightStyles,
} from './ManageScreen.style';
import { QuickTutorialButton } from './QuickTutorialButton';

export interface ManageScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableManageScreen;
  screenDelegate: ManageScreenDelegate;
}

@observer
export class ManageScreen extends React.Component<ManageScreenProps> {
  private get styles(): ManageScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View testID={ManageScreenIds.SCREEN} style={this.styles.screen}>
        <ManageBar
          theme={this.props.themeStore.theme}
          selectedSortType={this.props.observableScreen.selectedSortType}
          selectedFilterType={this.props.observableScreen.selectedFilterType}
          showCategorySortMenu={this.props.screenDelegate.showCategorySortMenu}
          showVocabularyFilterMenu={
            this.props.screenDelegate.showVocabularyFilterMenu
          }
        />
        {this.renderCategoryList()}
        {this.renderBulkActionBar()}
        {this.renderSyncingNotice()}
        {this.renderFloatingActionButton()}
      </View>
    );
  }

  private renderCategoryList(): React.ReactElement<any> {
    if (
      this.props.observableScreen.categoryListState.categoryList !== null &&
      this.props.observableScreen.categoryListState.noMore === true &&
      this.props.observableScreen.categoryListState.categoryList.size === 0
    ) {
      return this.renderEmptyComponent();
    } else {
      return (
        <CategoryList
          testID={ManageScreenIds.CATEGORY_LIST}
          theme={this.props.themeStore.theme}
          categoryListState={this.props.observableScreen.categoryListState}
          selectedFilterType={this.props.observableScreen.selectedFilterType}
          toggleSelection={this.props.screenDelegate.toggleSelection}
          showCategoryActionMenu={
            this.props.screenDelegate.showCategoryActionMenu
          }
          showCategoryDetail={this.props.screenDelegate.showCategoryDetail}
          fetchNext={this.props.screenDelegate.fetch}
          refresh={this.props.screenDelegate.refresh}
          goToSpacedRepetition={this.props.screenDelegate.goToSpacedRepetition}
          goToWriting={this.props.screenDelegate.goToWriting}
          showLevelBreakdownForSR={
            this.props.screenDelegate.showLevelBreakdownForSR
          }
          showLevelBreakdownForWR={
            this.props.screenDelegate.showLevelBreakdownForWR
          }
          shouldShowLevelProgressForSR={this.props.screenDelegate.shouldShowLevelProgressForSR()}
          shouldShowLevelProgressForWR={this.props.screenDelegate.shouldShowLevelProgressForWR()}
        />
      );
    }
  }

  private renderEmptyComponent(): React.ReactElement<any> {
    if (
      this.props.observableScreen.selectedFilterType.get() ===
      VocabularyFilterType.ACTIVE
    ) {
      return (
        <QuickTutorialButton
          refresh={this.props.screenDelegate.refresh}
          showQuickTutorial={this.props.screenDelegate.showQuickTutorial}
        />
      );
    } else {
      return <NoVocabulary refresh={this.props.screenDelegate.refresh} />;
    }
  }

  private renderBulkActionBar(): null | React.ReactElement<any> {
    if (this.shouldShowCategoryBulkActionBar()) {
      return (
        <View style={this.styles.bulk_action_bar_container}>
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
    if (!this.shouldShowCategoryBulkActionBar()) {
      return (
        <View style={this.styles.floating_action_button}>
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
    if (!this.shouldShowCategoryBulkActionBar()) {
      return (
        <View style={this.styles.syncing_notice}>
          <SyncingNotice
            shouldShowSyncingNotice={
              this.props.observableScreen.categoryListState
                .shouldShowSyncingNotice
            }
            shouldShowRefreshNotice={
              this.props.observableScreen.categoryListState
                .shouldShowRefreshNotice
            }
            refresh={this.props.screenDelegate.refresh}
          />
        </View>
      );
    } else {
      return null;
    }
  }
  private shouldShowCategoryBulkActionBar(): boolean {
    return (
      this.props.observableScreen.categoryListState.isSelectionModeOn.get() ===
      true
    );
  }
}
