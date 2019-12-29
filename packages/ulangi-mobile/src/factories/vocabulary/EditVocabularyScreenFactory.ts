/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableEditVocabularyScreen } from '@ulangi/ulangi-observable';

import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { DefinitionDelegate } from '../../delegates/vocabulary/DefinitionDelegate';
import { EditVocabularyDelegate } from '../../delegates/vocabulary/EditVocabularyDelegate';
import { EditVocabularyScreenDelegate } from '../../delegates/vocabulary/EditVocabularyScreenDelegate';
import { VocabularyFormDelegate } from '../../delegates/vocabulary/VocabularyFormDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class EditVocabularyScreenFactory extends ScreenFactory {
  public createDefinitionDelegate(): DefinitionDelegate {
    return new DefinitionDelegate();
  }

  public createSetSelectionMenuDelegate(): SetSelectionMenuDelegate {
    return new SetSelectionMenuDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.createNavigatorDelegate(),
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableEditVocabularyScreen,
  ): EditVocabularyScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const definitionDelegate = this.createDefinitionDelegate();

    const vocabularyFormDelegate = new VocabularyFormDelegate(
      this.props.observableLightBox,
      this.props.observableKeyboard,
      this.props.observableConverter,
      observableScreen.vocabularyFormState,
      definitionDelegate,
      dialogDelegate,
      navigatorDelegate,
    );

    const editVocabularyDelegate = new EditVocabularyDelegate(
      this.eventBus,
      this.props.observableConverter,
      observableScreen.originalEditingVocabulary,
      observableScreen.vocabularyFormState,
    );

    return new EditVocabularyScreenDelegate(
      this.eventBus,
      vocabularyFormDelegate,
      editVocabularyDelegate,
      navigatorDelegate,
    );
  }
}
