/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableDiscoverScreen } from '@ulangi/ulangi-observable';

import { AddVocabularyDelegate } from '../../delegates/discover/AddVocabularyDelegate';
import { DiscoverScreenDelegate } from '../../delegates/discover/DiscoverScreenDelegate';
import { PublicSetListDelegate } from '../../delegates/discover/PublicSetListDelegate';
import { PublicVocabularyActionMenuDelegate } from '../../delegates/discover/PublicVocabularyActionMenuDelegate';
import { PublicVocabularyListDelegate } from '../../delegates/discover/PublicVocabularyListDelegate';
import { TranslationActionMenuDelegate } from '../../delegates/discover/TranslationActionMenuDelegate';
import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { TranslationListDelegate } from '../../delegates/translation/TranslationListDelegate';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class DiscoverScreenFactory extends ScreenFactory {
  public createSetSelectionMenuDelegate(): SetSelectionMenuDelegate {
    return new SetSelectionMenuDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.createNavigatorDelegate(),
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableDiscoverScreen
  ): DiscoverScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const addVocabularyDelegate = new AddVocabularyDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.analytics
    );

    const publicSetListDelegate = new PublicSetListDelegate(
      this.eventBus,
      this.props.observableConverter,
      this.props.rootStore.setStore,
      observableScreen.publicSetCount,
      observableScreen.publicSetListState,
      this.props.analytics
    );

    const publicVocabularyListDelegate = new PublicVocabularyListDelegate(
      this.eventBus,
      this.props.observableConverter,
      this.props.rootStore.setStore,
      observableScreen.publicVocabularyListState,
      this.props.analytics
    );

    const translationListDelegate = new TranslationListDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      observableScreen.translationListState
    );

    const publicVocabularyActionMenuDelegate = new PublicVocabularyActionMenuDelegate(
      this.props.observableLightBox,
      this.props.rootStore.setStore,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const translationActionMenuDelegate = new TranslationActionMenuDelegate(
      this.props.observableLightBox,
      this.props.rootStore.setStore,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    return new DiscoverScreenDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      observableScreen,
      addVocabularyDelegate,
      publicSetListDelegate,
      publicVocabularyListDelegate,
      publicVocabularyActionMenuDelegate,
      translationListDelegate,
      translationActionMenuDelegate,
      navigatorDelegate,
      this.props.analytics
    );
  }
}
