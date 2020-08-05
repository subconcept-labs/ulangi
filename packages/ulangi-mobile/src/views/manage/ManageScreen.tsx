/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';
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
import { Screen } from '../common/Screen';
import { SyncingNotice } from '../sync/SyncingNotice';
import { AddVocabularyFloatingButton } from '../vocabulary/AddVocabularyFloatingButton';
import { NoVocabulary } from '../vocabulary/NoVocabulary';
import { ManageBar } from './ManageBar';
import {
  ManageScreenStyles,
  manageScreenResponsiveStyles,
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
    return manageScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        testID={ManageScreenIds.SCREEN}
        style={this.styles.screen}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={false}>
        <ManageBar
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
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
      </Screen>
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
          screenLayout={this.props.observableScreen.screenLayout}
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
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          refresh={this.props.screenDelegate.refresh}
          showQuickTutorial={this.props.screenDelegate.showQuickTutorial}
        />
      );
    } else {
      return (
        <NoVocabulary
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          refresh={this.props.screenDelegate.refresh}
        />
      );
    }
  }

  private renderBulkActionBar(): null | React.ReactElement<any> {
    if (this.shouldShowCategoryBulkActionBar()) {
      return (
        <View style={this.styles.bulk_action_bar_container}>
          <CategoryBulkActionBar
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
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
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
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
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
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
