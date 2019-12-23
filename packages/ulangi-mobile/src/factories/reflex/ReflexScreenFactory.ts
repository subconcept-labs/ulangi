/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableReflexScreen } from '@ulangi/ulangi-observable';

import { CategoryMessageDelegate } from '../../delegates/category/CategoryMessageDelegate';
import { FetchVocabularyDelegate } from '../../delegates/reflex/FetchVocabularyDelegate';
import { ReflexScreenDelegate } from '../../delegates/reflex/ReflexScreenDelegate';
import { TimerDelegate } from '../../delegates/reflex/TimerDelegate';
import { ReflexQuestionIterator } from '../../iterators/ReflexQuestionIterator';
import { ReflexStyle } from '../../styles/ReflexStyle';
import { ScreenFactory } from '../ScreenFactory';

export class ReflexScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableReflexScreen,
    questionIterator: ReflexQuestionIterator,
  ): ReflexScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      ReflexStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const fetchVocabularyDelegate = new FetchVocabularyDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      observableScreen,
      questionIterator,
    );

    const timerDelegate = new TimerDelegate(this.observer, observableScreen);

    const categoryMessageDelegate = new CategoryMessageDelegate(dialogDelegate);

    return new ReflexScreenDelegate(
      this.observer,
      this.props.observableLightBox,
      observableScreen,
      questionIterator,
      fetchVocabularyDelegate,
      timerDelegate,
      navigatorDelegate,
      categoryMessageDelegate,
      this.props.analytics,
    );
  }
}
