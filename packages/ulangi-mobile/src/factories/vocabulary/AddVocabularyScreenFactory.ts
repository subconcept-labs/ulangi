/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAddEditVocabularyScreen } from '@ulangi/ulangi-observable';

import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { AddVocabularyDelegate } from '../../delegates/vocabulary/AddVocabularyDelegate';
import { AddVocabularyScreenDelegate } from '../../delegates/vocabulary/AddVocabularyScreenDelegate';
import { DefinitionDelegate } from '../../delegates/vocabulary/DefinitionDelegate';
import { VocabularyFormDelegate } from '../../delegates/vocabulary/VocabularyFormDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class AddVocabularyScreenFactory extends ScreenFactory {
  public createSetSelectionMenuDelegate(): SetSelectionMenuDelegate {
    return new SetSelectionMenuDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.createNavigatorDelegate(),
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableAddEditVocabularyScreen
  ): AddVocabularyScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const definitionDelegate = new DefinitionDelegate();

    const vocabularyFormDelegate = new VocabularyFormDelegate(
      this.props.observableLightBox,
      this.props.observableKeyboard,
      this.props.observableConverter,
      observableScreen.vocabularyFormState,
      definitionDelegate,
      dialogDelegate,
      navigatorDelegate
    );

    const addVocabularyDelegate = new AddVocabularyDelegate(
      this.eventBus,
      this.props.observableConverter,
      this.props.rootStore.setStore,
      observableScreen.vocabularyFormState
    );

    return new AddVocabularyScreenDelegate(
      this.eventBus,
      this.props.observableConverter,
      observableScreen.vocabularyFormState,
      vocabularyFormDelegate,
      addVocabularyDelegate,
      navigatorDelegate,
      this.props.analytics
    );
  }
}
