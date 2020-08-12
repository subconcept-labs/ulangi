/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableReflexScreen } from '@ulangi/ulangi-observable';

import { FetchVocabularyDelegate } from '../../delegates/reflex/FetchVocabularyDelegate';
import { ReflexScreenDelegate } from '../../delegates/reflex/ReflexScreenDelegate';
import { TimerDelegate } from '../../delegates/reflex/TimerDelegate';
import { ReflexQuestionIterator } from '../../iterators/ReflexQuestionIterator';
import { reflexStyles } from '../../styles/ReflexStyles';
import { ScreenFactory } from '../ScreenFactory';

export class ReflexScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableReflexScreen,
    questionIterator: ReflexQuestionIterator,
  ): ReflexScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      reflexStyles.getLightBoxScreenStyles(),
    );

    const fetchVocabularyDelegate = new FetchVocabularyDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      observableScreen,
      questionIterator,
    );

    const timerDelegate = new TimerDelegate(this.observer, observableScreen);

    return new ReflexScreenDelegate(
      this.observer,
      this.props.observableLightBox,
      observableScreen,
      questionIterator,
      fetchVocabularyDelegate,
      timerDelegate,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
