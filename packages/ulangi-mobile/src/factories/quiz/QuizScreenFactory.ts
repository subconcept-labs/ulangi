/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableQuizScreen } from '@ulangi/ulangi-observable';

import { CategoryMessageDelegate } from '../../delegates/category/CategoryMessageDelegate';
import { QuizScreenDelegate } from '../../delegates/quiz/QuizScreenDelegate';
import { QuizSettingsDelegate } from '../../delegates/quiz/QuizSettingsDelegate';
import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class QuizScreenFactory extends ScreenFactory {
  public createSetSelectionMenuDelegateWithStyles(): SetSelectionMenuDelegate {
    return this.createSetSelectionMenuDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableQuizScreen,
  ): QuizScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const quizSettingsDelegate = new QuizSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );

    const categoryMessageDelegate = new CategoryMessageDelegate(dialogDelegate);

    return new QuizScreenDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen,
      quizSettingsDelegate,
      categoryMessageDelegate,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
