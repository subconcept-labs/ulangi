/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableCategoryDetailScreen } from '@ulangi/ulangi-observable';

import { CategoryActionMenuDelegate } from '../../delegates/category/CategoryActionMenuDelegate';
import { CategoryDetailScreenDelegate } from '../../delegates/category/CategoryDetailScreenDelegate';
import { FeatureSettingsDelegate } from '../../delegates/learn/FeatureSettingsDelegate';
import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { VocabularyActionMenuDelegate } from '../../delegates/vocabulary/VocabularyActionMenuDelegate';
import { VocabularyBulkActionMenuDelegate } from '../../delegates/vocabulary/VocabularyBulkActionMenuDelegate';
import { VocabularyBulkEditDelegate } from '../../delegates/vocabulary/VocabularyBulkEditDelegate';
import { VocabularyFilterMenuDelegate } from '../../delegates/vocabulary/VocabularyFilterMenuDelegate';
import { VocabularyListDelegate } from '../../delegates/vocabulary/VocabularyListDelegate';
import { VocabularyLiveUpdateDelegate } from '../../delegates/vocabulary/VocabularyLiveUpdateDelegate';
import { VocabularySelectionDelegate } from '../../delegates/vocabulary/VocabularySelectionDelegate';
import { VocabularySortMenuDelegate } from '../../delegates/vocabulary/VocabularySortMenuDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class CategoryDetailScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableCategoryDetailScreen,
  ): CategoryDetailScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const setSelectionMenuDelegate = new SetSelectionMenuDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const vocabularyBulkEditDelegate = new VocabularyBulkEditDelegate(
      this.eventBus,
    );

    const spacedRepetitionSettingsDelegate = new SpacedRepetitionSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );

    const writingSettingsDelegate = new WritingSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );

    const categoryActionMenuDelegate = new CategoryActionMenuDelegate(
      this.props.rootStore.setStore,
      this.observer,
      this.props.observableLightBox,
      undefined,
      setSelectionMenuDelegate,
      vocabularyBulkEditDelegate,
      spacedRepetitionSettingsDelegate,
      writingSettingsDelegate,
      dialogDelegate,
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const vocabularySelectionDelegate = new VocabularySelectionDelegate(
      observableScreen.vocabularyListState,
    );

    const vocabularyListDelegate = new VocabularyListDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.vocabularyListState,
      spacedRepetitionSettingsDelegate,
      writingSettingsDelegate,
    );

    const vocabularyFilterMenuDelegate = new VocabularyFilterMenuDelegate(
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const vocabularySortMenuDelegate = new VocabularySortMenuDelegate(
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const vocabularyActionMenuDelegate = new VocabularyActionMenuDelegate(
      this.eventBus,
      this.observer,
      this.props.observableLightBox,
      setSelectionMenuDelegate,
      vocabularySelectionDelegate,
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const vocabularyBulkActionMenuDelegate = new VocabularyBulkActionMenuDelegate(
      this.eventBus,
      this.observer,
      this.props.observableLightBox,
      observableScreen.vocabularyListState,
      setSelectionMenuDelegate,
      dialogDelegate,
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const vocabularyLiveUpdateDelegate = new VocabularyLiveUpdateDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.vocabularyListState,
    );

    const featureSettingsDelegate = new FeatureSettingsDelegate(
      this.props.rootStore.setStore,
    );

    return new CategoryDetailScreenDelegate(
      this.eventBus,
      observableScreen,
      categoryActionMenuDelegate,
      vocabularyListDelegate,
      vocabularyFilterMenuDelegate,
      vocabularySortMenuDelegate,
      vocabularyActionMenuDelegate,
      vocabularyBulkActionMenuDelegate,
      vocabularyLiveUpdateDelegate,
      vocabularySelectionDelegate,
      featureSettingsDelegate,
      navigatorDelegate,
    );
  }
}
