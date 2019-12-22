/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableQuizSettingsScreen } from '@ulangi/ulangi-observable';

import { QuizSettingsDelegate } from '../../delegates/quiz/QuizSettingsDelegate';
import { QuizSettingsScreenDelegate } from '../../delegates/quiz/QuizSettingsScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class QuizSettingsScreenFactory extends ScreenFactory {
  public createQuizSettingsDelegate(): QuizSettingsDelegate {
    return new QuizSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableQuizSettingsScreen
  ): QuizSettingsScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const quizSettingsDelegate = this.createQuizSettingsDelegate();

    return new QuizSettingsScreenDelegate(
      observableScreen,
      quizSettingsDelegate,
      navigatorDelegate
    );
  }
}
