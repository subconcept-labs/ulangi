/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableVocabularyDetailScreen } from '@ulangi/ulangi-observable';

import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { SpeakDelegate } from '../../delegates/vocabulary/SpeakDelegate';
import { VocabularyActionMenuDelegate } from '../../delegates/vocabulary/VocabularyActionMenuDelegate';
import { VocabularyDetailScreenDelegate } from '../../delegates/vocabulary/VocabularyDetailScreenDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class VocabularyDetailScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableVocabularyDetailScreen,
  ): VocabularyDetailScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const spacedRepetitionSettingsDelegate = new SpacedRepetitionSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );

    const writingSettingsDelegate = new WritingSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );

    const setSelectionMenuDelegate = new SetSelectionMenuDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const vocabularyActionMenuDelegate = new VocabularyActionMenuDelegate(
      this.eventBus,
      this.observer,
      this.props.observableLightBox,
      setSelectionMenuDelegate,
      undefined,
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const speakDelegate = new SpeakDelegate(this.eventBus);

    return new VocabularyDetailScreenDelegate(
      observableScreen,
      vocabularyActionMenuDelegate,
      speakDelegate,
      spacedRepetitionSettingsDelegate,
      writingSettingsDelegate,
      dialogDelegate,
    );
  }
}
