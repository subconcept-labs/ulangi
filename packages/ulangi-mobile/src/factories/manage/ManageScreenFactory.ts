/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableManageScreen } from '@ulangi/ulangi-observable';

import { AdDelegate } from '../../delegates/ad/AdDelegate';
import { CategoryActionMenuDelegate } from '../../delegates/category/CategoryActionMenuDelegate';
import { CategoryBulkActionMenuDelegate } from '../../delegates/category/CategoryBulkActionMenuDelegate';
import { CategoryListDelegate } from '../../delegates/category/CategoryListDelegate';
import { CategorySelectionDelegate } from '../../delegates/category/CategorySelectionDelegate';
import { CategorySortMenuDelegate } from '../../delegates/category/CategorySortMenuDelegate';
import { DataSharingDelegate } from '../../delegates/data-sharing/DataSharingDelegate';
import { FeatureSettingsDelegate } from '../../delegates/learn/FeatureSettingsDelegate';
import { LevelBreakdownDelegate } from '../../delegates/level/LevelBreakdownDelegate';
import { AutorunDelegate } from '../../delegates/manage/AutorunDelegate';
import { ManageScreenDelegate } from '../../delegates/manage/ManageScreenDelegate';
import { InAppRatingDelegate } from '../../delegates/rating/InAppRatingDelegate';
import { ReminderDelegate } from '../../delegates/reminder/ReminderDelegate';
import { ReminderSettingsDelegate } from '../../delegates/reminder/ReminderSettingsDelegate';
import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { VocabularyBulkEditDelegate } from '../../delegates/vocabulary/VocabularyBulkEditDelegate';
import { VocabularyFilterMenuDelegate } from '../../delegates/vocabulary/VocabularyFilterMenuDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class ManageScreenFactory extends ScreenFactory {
  public createSetSelectionMenuDelegateWithStyles(): SetSelectionMenuDelegate {
    return this.createSetSelectionMenuDelegate(
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableManageScreen,
  ): ManageScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const setSelectionMenuDelegate = this.createSetSelectionMenuDelegateWithStyles();

    const vocabularyFilterMenuDelegate = new VocabularyFilterMenuDelegate(
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const categorySortMenuDelegate = new CategorySortMenuDelegate(
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const categorySelectionDelegate = new CategorySelectionDelegate(
      observableScreen.categoryListState,
    );

    const vocabularyBulkEditDelegate = new VocabularyBulkEditDelegate(
      this.eventBus,
    );

    const categoryActionMenuDelegate = new CategoryActionMenuDelegate(
      this.props.rootStore.setStore,
      this.observer,
      this.props.observableLightBox,
      categorySelectionDelegate,
      setSelectionMenuDelegate,
      vocabularyBulkEditDelegate,
      dialogDelegate,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const categoryBulkActionMenuDelegate = new CategoryBulkActionMenuDelegate(
      this.observer,
      this.props.rootStore.setStore,
      this.props.observableLightBox,
      vocabularyBulkEditDelegate,
      setSelectionMenuDelegate,
      dialogDelegate,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const spacedRepetitionSettingsDelegate = new SpacedRepetitionSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );

    const writingSettingsDelegate = new WritingSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );

    const categoryListDelegate = new CategoryListDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.categoryListState,
      spacedRepetitionSettingsDelegate,
      writingSettingsDelegate,
    );

    const adDelegate = new AdDelegate(
      this.eventBus,
      this.props.rootStore.adStore,
      this.props.rootStore.userStore,
      this.props.rootStore.remoteConfigStore,
    );

    const rootScreenDelegate = this.createRootScreenDelegate();

    const reminderDelegate = new ReminderDelegate(this.eventBus);

    const reminderSettingsDelegate = new ReminderSettingsDelegate(
      this.props.rootStore.userStore,
      this.props.rootStore.notificationStore,
    );

    const featureSettingsDelegate = new FeatureSettingsDelegate(
      this.props.rootStore.setStore,
    );

    const dataSharingDelegate = new DataSharingDelegate(
      this.eventBus,
      this.observer,
      this.props.rootStore.userStore,
      this.props.rootStore.adStore,
    );

    const autorunDelegate = new AutorunDelegate(
      this.eventBus,
      this.observer,
      this.props.rootStore.userStore,
      adDelegate,
      reminderDelegate,
      reminderSettingsDelegate,
      dataSharingDelegate,
      dialogDelegate,
      rootScreenDelegate,
    );

    const levelBreakdownDelegate = new LevelBreakdownDelegate(
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const inAppRatingDelegate = new InAppRatingDelegate(
      this.eventBus,
      this.props.rootStore.userStore,
      this.props.rootStore.networkStore,
      this.props.rootStore.remoteConfigStore,
      dialogDelegate,
    );

    return new ManageScreenDelegate(
      this.eventBus,
      observableScreen,
      categoryListDelegate,
      categoryActionMenuDelegate,
      categoryBulkActionMenuDelegate,
      categorySelectionDelegate,
      categorySortMenuDelegate,
      levelBreakdownDelegate,
      vocabularyFilterMenuDelegate,
      featureSettingsDelegate,
      autorunDelegate,
      inAppRatingDelegate,
      navigatorDelegate,
    );
  }
}
