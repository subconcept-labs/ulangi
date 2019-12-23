/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorCode, ScreenName } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableQuizScreen,
  ObservableSetStore,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { boundClass } from 'autobind-decorator';
import { observable, toJS } from 'mobx';

import { config } from '../../constants/config';
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { CategoryMessageDelegate } from '../category/CategoryMessageDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { QuizSettingsDelegate } from './QuizSettingsDelegate';

@boundClass
export class QuizScreenDelegate {
  private errorConverter = new ErrorConverter();

  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private observableScreen: ObservableQuizScreen;
  private quizSettingsDelegate: QuizSettingsDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private categoryMessageDelegate: CategoryMessageDelegate;
  private analytics: AnalyticsAdapter;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    observableScreen: ObservableQuizScreen,
    quizSettingsDelegate: QuizSettingsDelegate,
    navigatorDelegate: NavigatorDelegate,
    categoryMessageDelegate: CategoryMessageDelegate,
    analytics: AnalyticsAdapter,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.observableScreen = observableScreen;
    this.quizSettingsDelegate = quizSettingsDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.categoryMessageDelegate = categoryMessageDelegate;
    this.analytics = analytics;
  }

  public startWritingQuiz(): void {
    this.analytics.logEvent('start_writing_quiz');
    const {
      vocabularyPool,
      writingQuizLimit,
    } = this.quizSettingsDelegate.getCurrentSettings();

    this.eventBus.pubsub(
      createAction(ActionType.QUIZ__FETCH_VOCABULARY_FOR_WRITING, {
        setId: this.setStore.existingCurrentSetId,
        vocabularyPool,
        limit: writingQuizLimit,
        selectedCategoryNames: toJS(
          this.observableScreen.selectedCategoryNames,
        ),
      }),
      group(
        on(
          ActionType.QUIZ__FETCHING_VOCABULARY_FOR_WRITING,
          this.showPreparingDialog,
        ),
        once(
          ActionType.QUIZ__FETCH_VOCABULARY_FOR_WRITING_SUCCEEDED,
          ({ vocabularyList }): void =>
            this.showPrepareSucceededDialog(vocabularyList, 'writing-quiz'),
        ),
        once(
          ActionType.QUIZ__FETCH_VOCABULARY_FOR_WRITING_FAILED,
          ({ errorCode }): void => {
            if (errorCode === ErrorCode.QUIZ__INSUFFICIENT_VOCABULARY) {
              this.showNotEnoughTermsDialog('writing-quiz', vocabularyPool);
            } else {
              this.showPrepareFailedDialog(errorCode);
            }
          },
        ),
      ),
    );
  }

  public startMultipleChoiceQuiz(): void {
    this.analytics.logEvent('start_multiple_choice_quiz');
    const {
      vocabularyPool,
      multipleChoiceQuizLimit,
    } = this.quizSettingsDelegate.getCurrentSettings();

    this.eventBus.pubsub(
      createAction(ActionType.QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE, {
        setId: this.setStore.existingCurrentSetId,
        vocabularyPool,
        limit: multipleChoiceQuizLimit,
        selectedCategoryNames: toJS(
          this.observableScreen.selectedCategoryNames,
        ),
      }),
      group(
        on(
          ActionType.QUIZ__FETCHING_VOCABULARY_FOR_MULTIPLE_CHOICE,
          this.showPreparingDialog,
        ),
        once(
          ActionType.QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE_SUCCEEDED,
          ({ vocabularyList }): void =>
            this.showPrepareSucceededDialog(
              vocabularyList,
              'multiple-choice-quiz',
            ),
        ),
        once(
          ActionType.QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE_FAILED,
          ({ errorCode }): void => {
            if (errorCode === ErrorCode.QUIZ__INSUFFICIENT_VOCABULARY) {
              this.showNotEnoughTermsDialog(
                'multiple-choice-quiz',
                vocabularyPool,
              );
            } else {
              this.showPrepareFailedDialog(errorCode);
            }
          },
        ),
      ),
    );
  }

  public showSettings(): void {
    this.navigatorDelegate.push(ScreenName.QUIZ_SETTINGS_SCREEN, {});
  }

  public showSelectSpecificCategoryMessage(): void {
    this.categoryMessageDelegate.showSelectSpecificCategoryMessage();
  }

  private showPreparingDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Preparing. Please wait...',
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showPrepareSucceededDialog(
    vocabularyList: readonly Vocabulary[],
    quizType: 'writing-quiz' | 'multiple-choice-quiz',
  ): void {
    this.navigatorDelegate.dismissLightBox();

    const observableVocabularyList = observable.map(
      vocabularyList.map(
        (vocabulary): [string, ObservableVocabulary] => {
          return [
            vocabulary.vocabularyId,
            this.observableConverter.convertToObservableVocabulary(vocabulary),
          ];
        },
      ),
    );

    if (quizType === 'writing-quiz') {
      this.navigatorDelegate.push(ScreenName.QUIZ_WRITING_SCREEN, {
        vocabularyList: observableVocabularyList,
        startWritingQuiz: this.startWritingQuiz,
      });
    } else {
      this.navigatorDelegate.push(ScreenName.QUIZ_MULTIPLE_CHOICE_SCREEN, {
        vocabularyList: observableVocabularyList,
        startMultipleChoiceQuiz: this.startMultipleChoiceQuiz,
      });
    }
  }

  private showNotEnoughTermsDialog(
    quizType: 'writing-quiz' | 'multiple-choice-quiz',
    vocabularyPool: 'learned' | 'active',
  ): void {
    const minRequired =
      quizType === 'writing-quiz'
        ? config.quiz.minPerWritingQuiz
        : config.quiz.minPerMultipleChoiceQuiz;

    const message =
      vocabularyPool === 'learned'
        ? `A minimum of ${minRequired} learned terms are required. Based on the settings, the quiz test only terms that you learned.`
        : `A minimum of ${minRequired} terms are required. Please add more terms.`;

    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message,
        title: 'FAILED TO START',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showPrepareFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        title: 'FAILED TO START QUIZ',
        showCloseButton: true,
        closeOnTouchOutside: true,
        message: this.errorConverter.convertToMessage(errorCode),
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }
}
