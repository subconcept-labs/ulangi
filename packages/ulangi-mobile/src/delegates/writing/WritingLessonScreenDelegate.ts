/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ActivityState,
  ButtonSize,
  Feedback,
  ScreenName,
  ScreenState,
} from '@ulangi/ulangi-common/enums';
import { EventBus } from '@ulangi/ulangi-event';
import {
  ObservableKeyboard,
  ObservableWritingLessonScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { when } from 'mobx';
import { BackHandler, Keyboard } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { WritingFormIds } from '../../constants/ids/WritingFormIds';
import { WritingQuestionIterator } from '../../iterators/WritingQuestionIterator';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { AdAfterLessonDelegate } from '../ad/AdAfterLessonDelegate';
import { AdDelegate } from '../ad/AdDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { ReviewFeedbackBarDelegate } from '../review-feedback/ReviewFeedbackBarDelegate';
import { WritingFormDelegate } from './WritingFormDelegate';
import { WritingSaveResultDelegate } from './WritingSaveResultDelegate';

@boundClass
export class WritingLessonScreenDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private observableKeyboard: ObservableKeyboard;
  private observableScreen: ObservableWritingLessonScreen;
  private questionIterator: WritingQuestionIterator;
  private saveResultDelegate: WritingSaveResultDelegate;
  private writingFormDelegate: WritingFormDelegate;
  private reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate;
  private adDelegate: AdDelegate;
  private adAfterLessonDelegate: AdAfterLessonDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private startLesson: () => void;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    observableKeyboard: ObservableKeyboard,
    observableScreen: ObservableWritingLessonScreen,
    questionIterator: WritingQuestionIterator,
    saveResultDelegate: WritingSaveResultDelegate,
    writingFormDelegate: WritingFormDelegate,
    reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate,
    adDelegate: AdDelegate,
    adAfterLessonDelegate: AdAfterLessonDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    startLesson: () => void,
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.observableKeyboard = observableKeyboard;
    this.observableScreen = observableScreen;
    this.questionIterator = questionIterator;
    this.saveResultDelegate = saveResultDelegate;
    this.writingFormDelegate = writingFormDelegate;
    this.reviewFeedbackBarDelegate = reviewFeedbackBarDelegate;
    this.adDelegate = adDelegate;
    this.adAfterLessonDelegate = adAfterLessonDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.startLesson = startLesson;
  }

  public showHint(): void {
    this.writingFormDelegate.showHint();
  }

  public setAnswer(text: string): void {
    if (
      this.observableScreen.writingFormState.isCurrentAnswerCorrect === false
    ) {
      this.observableScreen.writingFormState.currentAnswer = text;
      this.checkAnswer();
    }
  }

  public checkAnswer(): void {
    if (this.observableScreen.writingFormState.isCurrentAnswerCorrect) {
      this.writingFormDelegate.recordWhetherHintUsed();
      Keyboard.dismiss();
      when(
        (): boolean => this.observableKeyboard.state === 'hidden',
        (): void => {
          this.showReviewFeedbackBar();
        },
      );
    }
  }

  public showAnswer(): void {
    this.observableScreen.writingFormState.currentAnswer = this.observableScreen.writingFormState.currentQuestion.testingVocabulary.vocabularyTerm;
  }

  public setFeedback(feedback: Feedback): void {
    this.observableScreen.feedbackListState.feedbackList.set(
      this.observableScreen.writingFormState.currentQuestion.testingVocabulary
        .vocabularyId,
      feedback,
    );

    this.reviewFeedbackBarDelegate.hide();

    this.nextQuestion();
  }

  public disable(): void {
    this.dialogDelegate.showSuccessDialog({
      message:
        'Are you sure you want to disable writing this vocabulary term permanently?',
      onBackgroundPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
      },
      buttonList: [
        {
          testID: WritingFormIds.CANCEL_DISABLE_BTN,
          text: 'NO',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
        {
          testID: WritingFormIds.CONFIRM_DISABLE_BTN,
          text: 'YES',
          onPress: (): void => {
            const vocabularyId = this.observableScreen.writingFormState
              .currentQuestion.testingVocabulary.vocabularyId;
            const editedVocabulary = {
              vocabularyId,
              writing: { disabled: true },
            };
            this.eventBus.publish(
              createAction(ActionType.VOCABULARY__EDIT, {
                vocabulary: editedVocabulary,
                setId: undefined,
              }),
            );

            this.observableScreen.writingResult.disabledVocabularyIds.push(
              vocabularyId,
            );
            this.nextQuestion();
            this.navigatorDelegate.dismissLightBox();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
      ],
    });
  }

  public autoDisablePopGestureWhenAdRequiredToShow(): void {
    this.adAfterLessonDelegate.autoDisablePopGestureWhenAdRequiredToShow();
  }

  public shouldLoadAd(): boolean {
    return this.adDelegate.shouldLoadAd();
  }

  public loadAd(): void {
    this.adDelegate.loadAd();
  }

  public handleBackButton(): boolean {
    return this.adAfterLessonDelegate.handleShowAdOrGoogleConsentForm();
  }

  public addBackButtonHandler(handler: () => void): void {
    BackHandler.addEventListener('hardwareBackPress', handler);
  }

  public removeBackButtonHandler(handler: () => void): void {
    BackHandler.removeEventListener('hardwareBackPress', handler);
  }

  public showAdOrGoogleConsentForm(onClose: () => void): void {
    this.adAfterLessonDelegate.showAdOrGoogleConsentForm(onClose);
  }

  public takeAnotherLesson(): void {
    this.quit();
    this.observer.when(
      (): boolean =>
        this.observableScreen.screenState === ScreenState.UNMOUNTED,
      (): void => this.startLesson(),
    );
  }

  public quit(): void {
    if (this.observableScreen.shouldShowAdOrGoogleConsentForm.get()) {
      this.adAfterLessonDelegate.showAdOrGoogleConsentForm(
        (): void => this.navigatorDelegate.pop(),
      );
    } else {
      this.navigatorDelegate.pop();
    }
  }

  public showReviewFeedback(): void {
    this.navigatorDelegate.push(ScreenName.REVIEW_FEEDBACK_SCREEN, {
      lessonType: 'writing',
      vocabularyList: this.observableScreen.vocabularyList.toJS(),
      originalFeedbackList: this.observableScreen.feedbackListState
        .feedbackList,
      onSaveSucceeded: this.updateFeedbackList,
    });
  }

  public showConfirmQuitLessonDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message:
        'The lesson result is not yet saved. Are you sure you want to quit?',
      onBackgroundPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
      },
      buttonList: [
        {
          testID: LightBoxDialogIds.CLOSE_DIALOG_BTN,
          text: 'NO',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
        {
          testID: LightBoxDialogIds.OKAY_BTN,
          text: 'YES',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
            this.navigatorDelegate.pop();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
      ],
    });
  }

  private showReviewFeedbackBar(): void {
    this.reviewFeedbackBarDelegate.showFeedbackButtons(
      this.observableScreen.writingFormState.currentQuestion.testingVocabulary,
      this.observableScreen.numberOfFeedbackButtons.get(),
    );
  }

  private nextQuestion(): void {
    if (this.questionIterator.isDone() === false) {
      this.writingFormDelegate.fadeOut(
        (): void => {
          this.observableScreen.writingFormState.setUpNextQuestion(
            this.questionIterator.next(),
          );
        },
      );
    } else {
      this.observableScreen.shouldShowAdOrGoogleConsentForm.set(
        this.adDelegate.shouldShowAdOrGoogleConsentForm(),
      );

      this.observableScreen.shouldShowResult.set(true);
      this.saveResult();
    }
  }

  private saveResult(): void {
    this.saveResultDelegate.save(true, {
      onSaving: (): void => {
        this.observableScreen.saveState.set(ActivityState.ACTIVE);
      },
      onSaveSucceeded: (): void => {
        this.observableScreen.saveState.set(ActivityState.INACTIVE);
      },
      onSaveFailed: (): void => {
        this.observableScreen.saveState.set(ActivityState.ERROR);
      },
    });
  }

  private updateFeedbackList(
    feedbackList: ReadonlyMap<string, Feedback>,
  ): void {
    this.observableScreen.feedbackListState.feedbackList.replace(feedbackList);
  }
}
