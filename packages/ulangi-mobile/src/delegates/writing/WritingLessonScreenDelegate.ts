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
  ObservableConverter,
  ObservableKeyboard,
  ObservableSetStore,
  ObservableWritingLessonScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { when } from 'mobx';
import { BackHandler, Keyboard } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { WritingFormIds } from '../../constants/ids/WritingFormIds';
import { ReviewActionButtonFactory } from '../../factories/review-action/ReviewActionButtonFactory';
import { WritingQuestionIterator } from '../../iterators/WritingQuestionIterator';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { AdAfterLessonDelegate } from '../ad/AdAfterLessonDelegate';
import { AdDelegate } from '../ad/AdDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { ReviewFeedbackBarDelegate } from '../review-feedback/ReviewFeedbackBarDelegate';
import { SpeakDelegate } from '../vocabulary/SpeakDelegate';
import { WritingFormDelegate } from './WritingFormDelegate';
import { WritingSaveResultDelegate } from './WritingSaveResultDelegate';

@boundClass
export class WritingLessonScreenDelegate {
  private reviewActionButtonFactory = new ReviewActionButtonFactory();

  private eventBus: EventBus;
  private observer: Observer;
  private observableConverter: ObservableConverter;
  private observableKeyboard: ObservableKeyboard;
  private setStore: ObservableSetStore;
  private observableScreen: ObservableWritingLessonScreen;
  private questionIterator: WritingQuestionIterator;
  private saveResultDelegate: WritingSaveResultDelegate;
  private writingFormDelegate: WritingFormDelegate;
  private reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate;
  private speakDelegate: SpeakDelegate;
  private adDelegate: AdDelegate;
  private adAfterLessonDelegate: AdAfterLessonDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private startLesson: () => void;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    observableKeyboard: ObservableKeyboard,
    observableConverter: ObservableConverter,
    setStore: ObservableSetStore,
    observableScreen: ObservableWritingLessonScreen,
    questionIterator: WritingQuestionIterator,
    saveResultDelegate: WritingSaveResultDelegate,
    writingFormDelegate: WritingFormDelegate,
    reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate,
    speakDelegate: SpeakDelegate,
    adDelegate: AdDelegate,
    adAfterLessonDelegate: AdAfterLessonDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    startLesson: () => void,
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.observableConverter = observableConverter;
    this.observableKeyboard = observableKeyboard;
    this.setStore = setStore;
    this.observableScreen = observableScreen;
    this.questionIterator = questionIterator;
    this.saveResultDelegate = saveResultDelegate;
    this.writingFormDelegate = writingFormDelegate;
    this.reviewFeedbackBarDelegate = reviewFeedbackBarDelegate;
    this.speakDelegate = speakDelegate;
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

  public setUpActionButtons(): void {
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
        testingVocabulary.vocabularyTerm,
        (): void => {
          this.synthesizeAndSpeak(testingVocabulary.vocabularyTerm);
        },
      ),
      this.reviewActionButtonFactory.createEditButton(
        (): void => {
          this.navigatorDelegate.push(ScreenName.EDIT_VOCABULARY_SCREEN, {
            originalVocabulary: testingVocabulary.toRaw(),
            onSave: (newVocabulary): void => {
              const observableVocabulary = this.observableConverter.convertToObservableVocabulary(
                newVocabulary,
              );

              this.observableScreen.writingFormState.currentQuestion.testingVocabulary = observableVocabulary;

              this.observableScreen.vocabularyList.set(
                observableVocabulary.vocabularyId,
                observableVocabulary,
              );
              this.questionIterator.update(
                observableVocabulary.vocabularyId,
                observableVocabulary,
              );
            },
          });
        },
      ),
      this.reviewActionButtonFactory.createDisableButton(
        (): void => {
          this.disable();
        },
      ),
    ]);
  }

  public disableAllButtons(): void {
    this.observableScreen.reviewActionBarState.buttons.forEach(
      (button): void => {
        button.disabled = true;
      },
    );
  }

  public autoUpdateButtons(): void {
    this.observer.reaction(
      (): boolean =>
        this.observableScreen.speakState.get() === ActivityState.ACTIVE,
      (isSpeaking): void => {
        this.observableScreen.reviewActionBarState.buttons.forEach(
          (button): void => {
            if (button.title === 'PLAY AUDIO') {
              button.loading = isSpeaking;
              button.disabled = isSpeaking;
            }
          },
        );
      },
    );
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
    this.dialogDelegate.show({
      message:
        'Do you want to disable writing for this term? You will no longer write it again but you will still see it in other lesson types.',
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

  private previousQuestion(): void {
    this.writingFormDelegate.fadeOut(
      (): void => {
        this.observableScreen.writingFormState.setUpNextQuestion(
          this.questionIterator.previous(),
        );
      },
    );
  }

  private nextQuestion(): void {
    if (this.questionIterator.isDone() === false) {
      this.disableAllButtons();
      this.writingFormDelegate.fadeOut(
        (): void => {
          this.observableScreen.writingFormState.setUpNextQuestion(
            this.questionIterator.next(),
          );
          this.setUpActionButtons();
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

  private synthesizeAndSpeak(text: string): void {
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
          this.dialogDelegate.showFailedDialog(errorBag);
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
}
