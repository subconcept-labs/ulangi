/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ActivityState,
  ButtonSize,
  Feedback,
  ReviewPriority,
  ScreenName,
  ScreenState,
} from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableVocabulary,
  ObservableWritingLessonScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { BackHandler, Keyboard } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ReviewActionBarIds } from '../../constants/ids/ReviewActionBarIds';
import { ReviewActionButtonFactory } from '../../factories/review-action/ReviewActionButtonFactory';
import { WritingQuestionIterator } from '../../iterators/WritingQuestionIterator';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { AdAfterLessonDelegate } from '../ad/AdAfterLessonDelegate';
import { AdDelegate } from '../ad/AdDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { ReviewActionMenuDelegate } from '../review-action/ReviewActionMenuDelegate';
import { ReviewFeedbackBarDelegate } from '../review-feedback/ReviewFeedbackBarDelegate';
import { SpeakDelegate } from '../vocabulary/SpeakDelegate';
import { WritingCountsDelegate } from './WritingCountsDelegate';
import { WritingFormDelegate } from './WritingFormDelegate';
import { WritingSaveResultDelegate } from './WritingSaveResultDelegate';

@boundClass
export class WritingLessonScreenDelegate {
  private reviewActionButtonFactory = new ReviewActionButtonFactory();

  private observer: Observer;
  private observableConverter: ObservableConverter;
  private setStore: ObservableSetStore;
  private observableScreen: ObservableWritingLessonScreen;
  private questionIterator: WritingQuestionIterator;
  private saveResultDelegate: WritingSaveResultDelegate;
  private countsDelegate: WritingCountsDelegate;
  private writingFormDelegate: WritingFormDelegate;
  private reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate;
  private speakDelegate: SpeakDelegate;
  private adDelegate: AdDelegate;
  private adAfterLessonDelegate: AdAfterLessonDelegate;
  private reviewActionMenuDelegate: ReviewActionMenuDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private currentCategoryNames: undefined | readonly string[];
  private startLesson: (
    overrideReviewPriority: undefined | ReviewPriority,
  ) => void;

  public constructor(
    observer: Observer,
    observableConverter: ObservableConverter,
    setStore: ObservableSetStore,
    observableScreen: ObservableWritingLessonScreen,
    questionIterator: WritingQuestionIterator,
    saveResultDelegate: WritingSaveResultDelegate,
    countsDelegate: WritingCountsDelegate,
    writingFormDelegate: WritingFormDelegate,
    reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate,
    speakDelegate: SpeakDelegate,
    adDelegate: AdDelegate,
    adAfterLessonDelegate: AdAfterLessonDelegate,
    reviewActionMenuDelegate: ReviewActionMenuDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    currentCategoryNames: undefined | readonly string[],
    startLesson: (overrideReviewPriority: undefined | ReviewPriority) => void,
  ) {
    this.observer = observer;
    this.observableConverter = observableConverter;
    this.setStore = setStore;
    this.observableScreen = observableScreen;
    this.questionIterator = questionIterator;
    this.saveResultDelegate = saveResultDelegate;
    this.countsDelegate = countsDelegate;
    this.writingFormDelegate = writingFormDelegate;
    this.reviewFeedbackBarDelegate = reviewFeedbackBarDelegate;
    this.speakDelegate = speakDelegate;
    this.adDelegate = adDelegate;
    this.adAfterLessonDelegate = adAfterLessonDelegate;
    this.reviewActionMenuDelegate = reviewActionMenuDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.currentCategoryNames = currentCategoryNames;
    this.startLesson = startLesson;
  }

  public setUp(): void {
    this.autoDisablePopGestureWhenAdRequiredToShow();
    this.addBackButtonHandler(this.handleBackPressed);
    this.setUpActionButtons();
    this.calculateNextReviewData();
    this.autoUpdateButtons();

    if (this.shouldLoadAd()) {
      this.loadAd();
    }
  }

  public cleanUp(): void {
    this.removeBackButtonHandler(this.handleBackPressed);
  }

  public handleBackPressed(): boolean {
    if (this.observableScreen.saveState.get() === ActivityState.ACTIVE) {
      this.showSavingInProgressDialog();
      return true;
    } else if (this.observableScreen.shouldShowResult.get() === false) {
      this.showConfirmQuitLessonDialog();
      return true;
    } else {
      this.showAdIfRequiredThenQuit();
      return true;
    }
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

      if (this.observableScreen.autoplayAudio.get() === true) {
        this.synthesizeAndSpeak(
          this.observableScreen.writingFormState.currentQuestion
            .testingVocabulary.vocabularyTerm,
          true,
        );
      }
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

    this.nextQuestion();
  }

  public endLesson(): void {
    // Check if lesson ended
    if (this.observableScreen.shouldShowResult.get() === false) {
      this.observableScreen.shouldShowResult.set(true);
      this.saveResult();

      this.observableScreen.shouldShowAdOrGoogleConsentForm.set(
        this.adDelegate.shouldShowAdOrGoogleConsentForm(),
      );
    }
  }

  public takeAnotherLesson(
    overrideReviewPriority: undefined | ReviewPriority,
  ): void {
    this.showAdIfRequiredThenQuit();
    this.observer.when(
      (): boolean =>
        this.observableScreen.screenState === ScreenState.UNMOUNTED,
      (): void => this.startLesson(overrideReviewPriority),
    );
  }

  public showAdIfRequiredThenQuit(): void {
    if (this.observableScreen.shouldShowAdOrGoogleConsentForm.get()) {
      this.adAfterLessonDelegate.showAdOrGoogleConsentForm(
        (): void => this.navigatorDelegate.dismissScreen(),
      );
    } else {
      this.navigatorDelegate.dismissScreen();
    }
  }

  public showReviewFeedback(): void {
    this.navigatorDelegate.showModal(ScreenName.REVIEW_FEEDBACK_SCREEN, {
      lessonType: 'writing',
      vocabularyList: this.observableScreen.vocabularyList.toJS(),
      originalFeedbackList: this.observableScreen.feedbackListState
        .feedbackList,
      onSaveSucceeded: (feedbackList: ReadonlyMap<string, Feedback>): void => {
        this.updateFeedbackList(feedbackList);
        this.refreshDueAndNewCounts();
      },
    });
  }

  public goToAccountTypeScreen(): void {
    this.navigatorDelegate.push(ScreenName.MEMBERSHIP_SCREEN, {});
  }

  private setUpActionButtons(): void {
    const {
      testingVocabulary,
    } = this.observableScreen.writingFormState.currentQuestion;

    this.observableScreen.reviewActionBarState.buttons.replace([
      this.reviewActionButtonFactory.createPreviousButton(
        this.observableScreen.writingFormState.currentQuestionIndex === 0,
        (): void => this.previousQuestion(),
      ),
      this.reviewActionButtonFactory.createPlayAudioButton(
        this.observableScreen.writingFormState.isCurrentAnswerCorrect === true
          ? testingVocabulary.vocabularyTerm
          : '',
        (): void => {
          this.synthesizeAndSpeak(testingVocabulary.vocabularyTerm, false);
        },
      ),
      this.reviewActionButtonFactory.createSkipButton(
        this.observableScreen.writingFormState.isCurrentAnswerCorrect === true,
        (): void => {
          this.setAnswer(
            this.observableScreen.writingFormState.currentQuestion
              .testingVocabulary.vocabularyTerm,
          );
        },
      ),
      this.reviewActionButtonFactory.createEditButton(
        (): void => {
          this.navigatorDelegate.push(ScreenName.EDIT_VOCABULARY_SCREEN, {
            originalVocabulary: testingVocabulary.toRaw(),
            onSave: (newVocabulary): void => {
              this.replaceCurrentVocabulary(
                this.observableConverter.convertToObservableVocabulary(
                  newVocabulary,
                ),
              );
              this.setUpActionButtons();
            },
          });
        },
      ),
      this.reviewActionButtonFactory.createMoreButton(
        (): void => this.showReviewActionMenu(),
      ),
    ]);
  }

  private disableAllButtons(): void {
    this.observableScreen.reviewActionBarState.buttons.forEach(
      (button): void => {
        button.disabled = true;
      },
    );
  }

  private autoUpdateButtons(): void {
    this.observer.reaction(
      (): boolean =>
        this.observableScreen.speakState.get() === ActivityState.ACTIVE,
      (isSpeaking): void => {
        this.observableScreen.reviewActionBarState.buttons.forEach(
          (button): void => {
            if (button.testID === ReviewActionBarIds.PLAY_AUDIO_BTN) {
              button.loading = isSpeaking;
              button.disabled = isSpeaking;
            }
          },
        );
      },
    );

    this.observer.reaction(
      (): boolean =>
        this.observableScreen.writingFormState.isCurrentAnswerCorrect,
      (isCurrentAnswerCorrect): void => {
        if (isCurrentAnswerCorrect === true) {
          this.observableScreen.reviewActionBarState.buttons.forEach(
            (button): void => {
              if (button.testID === ReviewActionBarIds.PLAY_AUDIO_BTN) {
                button.subtitle = this.observableScreen.writingFormState.currentQuestion.testingVocabulary.vocabularyTerm;
              }
              if (button.testID === ReviewActionBarIds.SKIP_BTN) {
                button.disabled = true;
              }
            },
          );
        }
      },
    );
  }

  private autoDisablePopGestureWhenAdRequiredToShow(): void {
    this.adAfterLessonDelegate.autoDisablePopGestureWhenAdRequiredToShow();
  }

  private shouldLoadAd(): boolean {
    return this.adDelegate.shouldLoadAd();
  }

  private loadAd(): void {
    this.adDelegate.loadAd();
  }

  private addBackButtonHandler(handler: () => void): void {
    BackHandler.addEventListener('hardwareBackPress', handler);
  }

  private removeBackButtonHandler(handler: () => void): void {
    BackHandler.removeEventListener('hardwareBackPress', handler);
  }

  private showSavingInProgressDialog(): void {
    this.dialogDelegate.show({
      message:
        'Saving in progress. Please wait until save is completed then try again.',
      showCloseButton: true,
      closeOnTouchOutside: true,
    });
  }

  private showConfirmQuitLessonDialog(): void {
    this.dialogDelegate.show({
      message:
        'Do you want to quit without saving? To save result and end this lesson, please use End instead.',
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
          responsiveStyles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
        {
          testID: LightBoxDialogIds.OKAY_BTN,
          text: 'YES',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
            this.navigatorDelegate.dismissScreen();
          },
          responsiveStyles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
      ],
    });
  }

  public previousQuestion(): void {
    this.writingFormDelegate.fadeOut(
      (): void => {
        this.observableScreen.writingFormState.setUpQuestion(
          this.questionIterator.previous(),
        );
        this.calculateNextReviewData();
        this.setUpActionButtons();
      },
    );
  }

  public nextQuestion(): void {
    if (this.questionIterator.isDone() === true) {
      this.endLesson();
    } else {
      this.disableAllButtons();
      this.writingFormDelegate.fadeOut(
        (): void => {
          this.observableScreen.writingFormState.setUpQuestion(
            this.questionIterator.next(),
          );
          this.calculateNextReviewData();
          this.setUpActionButtons();
        },
      );
    }
  }

  private calculateNextReviewData(): void {
    this.reviewFeedbackBarDelegate.calculateNextReviewData(
      this.observableScreen.writingFormState.currentQuestion.testingVocabulary,
      this.observableScreen.numberOfFeedbackButtons.get(),
    );
  }

  private saveResult(): void {
    this.saveResultDelegate.save(true, {
      onSaving: (): void => {
        this.observableScreen.saveState.set(ActivityState.ACTIVE);
      },
      onSaveSucceeded: (): void => {
        this.observableScreen.saveState.set(ActivityState.INACTIVE);
        this.refreshDueAndNewCounts();
      },
      onSaveFailed: (): void => {
        this.observableScreen.saveState.set(ActivityState.ERROR);
      },
    });
  }

  private refreshDueAndNewCounts(): void {
    this.countsDelegate.refreshDueAndNewCounts(
      typeof this.currentCategoryNames !== 'undefined'
        ? this.currentCategoryNames.slice()
        : undefined,
      (dueCount, newCount): void => {
        this.observableScreen.counts = {
          due: dueCount,
          new: newCount,
        };
      },
    );
  }

  private updateFeedbackList(
    feedbackList: ReadonlyMap<string, Feedback>,
  ): void {
    this.observableScreen.feedbackListState.feedbackList.replace(feedbackList);
  }

  private synthesizeAndSpeak(text: string, autoplayed: boolean): void {
    this.speakDelegate.synthesize(
      text,
      this.setStore.existingCurrentSet.learningLanguageCode,
      {
        onSynthesizing: (): void => {
          this.observableScreen.speakState.set(ActivityState.ACTIVE);
        },
        onSynthesizeSucceeded: (filePath): void => {
          this.speak(filePath);
        },
        onSynthesizeFailed: (errorBag): void => {
          this.observableScreen.speakState.set(ActivityState.INACTIVE);
          if (autoplayed === false) {
            this.dialogDelegate.showFailedDialog(errorBag);
          }
        },
      },
    );
  }

  private speak(filePath: string): void {
    this.speakDelegate.speak(filePath, {
      onSpeaking: (): void => {
        this.observableScreen.speakState.set(ActivityState.ACTIVE);
      },
      onSpeakSucceeded: (): void => {
        this.observableScreen.speakState.set(ActivityState.INACTIVE);
      },
      onSpeakFailed: (): void => {
        this.observableScreen.speakState.set(ActivityState.INACTIVE);
      },
    });
  }

  private showReviewActionMenu(): void {
    this.reviewActionMenuDelegate.show(
      this.observableScreen.writingFormState.currentQuestion.testingVocabulary,
    );
  }

  private replaceCurrentVocabulary(newVocabulary: ObservableVocabulary): void {
    this.observableScreen.writingFormState.currentQuestion.testingVocabulary = newVocabulary;

    this.observableScreen.vocabularyList.set(
      newVocabulary.vocabularyId,
      newVocabulary,
    );
    this.questionIterator.update(newVocabulary.vocabularyId, newVocabulary);
  }
}
