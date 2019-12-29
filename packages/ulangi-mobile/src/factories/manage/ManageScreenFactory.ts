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
import { LevelBreakdownDelegate } from '../../delegates/level/LevelBreakdownDelegate';
import { AutorunDelegate } from '../../delegates/manage/AutorunDelegate';
import { ManageListSelectionMenuDelegate } from '../../delegates/manage/ManageListSelectionMenuDelegate';
import { ManageScreenDelegate } from '../../delegates/manage/ManageScreenDelegate';
import { ReminderDelegate } from '../../delegates/reminder/ReminderDelegate';
import { ReminderSettingsDelegate } from '../../delegates/reminder/ReminderSettingsDelegate';
import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { VocabularyActionMenuDelegate } from '../../delegates/vocabulary/VocabularyActionMenuDelegate';
import { VocabularyBulkActionMenuDelegate } from '../../delegates/vocabulary/VocabularyBulkActionMenuDelegate';
import { VocabularyEventDelegate } from '../../delegates/vocabulary/VocabularyEventDelegate';
import { VocabularyFilterMenuDelegate } from '../../delegates/vocabulary/VocabularyFilterMenuDelegate';
import { VocabularyListDelegate } from '../../delegates/vocabulary/VocabularyListDelegate';
import { VocabularyLiveUpdateDelegate } from '../../delegates/vocabulary/VocabularyLiveUpdateDelegate';
import { VocabularySelectionDelegate } from '../../delegates/vocabulary/VocabularySelectionDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class ManageScreenFactory extends ScreenFactory {
  public createSetSelectionMenuDelegate(): SetSelectionMenuDelegate {
    return new SetSelectionMenuDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.createNavigatorDelegate(),
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

    const setSelectionMenuDelegate = this.createSetSelectionMenuDelegate();

    const manageListSelectionMenuDelegate = new ManageListSelectionMenuDelegate(
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const vocabularyEventDelegate = new VocabularyEventDelegate(this.eventBus);

    const vocabularyFilterMenuDelegate = new VocabularyFilterMenuDelegate(
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

    const vocabularyListDelegate = new VocabularyListDelegate(
      true,
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.vocabularyListState,
      spacedRepetitionSettingsDelegate,
      writingSettingsDelegate,
    );

    const vocabularySelectionDelegate = new VocabularySelectionDelegate(
      observableScreen.vocabularyListState,
    );

    const vocabularyActionMenuDelegate = new VocabularyActionMenuDelegate(
      this.eventBus,
      this.observer,
      this.props.observableLightBox,
      setSelectionMenuDelegate,
      vocabularySelectionDelegate,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const vocabularyBulkActionMenuDelegate = new VocabularyBulkActionMenuDelegate(
      this.eventBus,
      this.observer,
      this.props.observableLightBox,
      observableScreen.vocabularyListState,
      setSelectionMenuDelegate,
      dialogDelegate,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const categorySelectionDelegate = new CategorySelectionDelegate(
      observableScreen.categoryListState,
    );

    const categoryActionMenuDelegate = new CategoryActionMenuDelegate(
      this.props.observableLightBox,
      categorySelectionDelegate,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const categoryBulkActionMenuDelegate = new CategoryBulkActionMenuDelegate(
      this.props.observableLightBox,
      observableScreen.categoryListState,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const categoryListDelegate = new CategoryListDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.categoryListState,
      spacedRepetitionSettingsDelegate,
      writingSettingsDelegate,
    );

    const vocabularyLiveUpdateDelegate = new VocabularyLiveUpdateDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.vocabularyListState,
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

    const autorunDelegate = new AutorunDelegate(
      this.eventBus,
      this.observer,
      this.props.rootStore.userStore,
      adDelegate,
      reminderDelegate,
      reminderSettingsDelegate,
      dialogDelegate,
      rootScreenDelegate,
    );

    const levelBreakdownDelegate = new LevelBreakdownDelegate(
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    return new ManageScreenDelegate(
      this.eventBus,
      observableScreen,
      categoryListDelegate,
      categoryActionMenuDelegate,
      categoryBulkActionMenuDelegate,
      categorySelectionDelegate,
      levelBreakdownDelegate,
      vocabularyEventDelegate,
      vocabularyListDelegate,
      vocabularyActionMenuDelegate,
      vocabularyBulkActionMenuDelegate,
      vocabularyFilterMenuDelegate,
      vocabularyLiveUpdateDelegate,
      vocabularySelectionDelegate,
      manageListSelectionMenuDelegate,
      autorunDelegate,
      navigatorDelegate,
    );
  }
}
