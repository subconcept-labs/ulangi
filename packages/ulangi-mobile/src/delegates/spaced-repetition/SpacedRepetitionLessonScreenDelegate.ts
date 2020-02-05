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
  ScreenName,
  ScreenState,
} from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableSpacedRepetitionLessonScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { BackHandler } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ReviewActionButtonFactory } from '../../factories/review-action/ReviewActionButtonFactory';
import { ReviewIterator } from '../../iterators/ReviewIterator';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { AdAfterLessonDelegate } from '../ad/AdAfterLessonDelegate';
import { AdDelegate } from '../ad/AdDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { ReviewFeedbackBarDelegate } from '../review-feedback/ReviewFeedbackBarDelegate';
import { SpeakDelegate } from '../vocabulary/SpeakDelegate';
import { SpacedRepetitionSaveResultDelegate } from './SpacedRepetitionSaveResultDelegate';

@boundClass
export class SpacedRepetitionLessonScreenDelegate {
  private reviewActionButtonFactory = new ReviewActionButtonFactory();

  private observer: Observer;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private observableScreen: ObservableSpacedRepetitionLessonScreen;
  private reviewIterator: ReviewIterator;
  private reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate;
  private saveResultDelegate: SpacedRepetitionSaveResultDelegate;
  private speakDelegate: SpeakDelegate;
  private adDelegate: AdDelegate;
  private adAfterLessonDelegate: AdAfterLessonDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private startLesson: () => void;

  public constructor(
    observer: Observer,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    observableScreen: ObservableSpacedRepetitionLessonScreen,
    reviewIterator: ReviewIterator,
    reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate,
    saveResultDelegate: SpacedRepetitionSaveResultDelegate,
    speakDelegate: SpeakDelegate,
    adDelegate: AdDelegate,
    adAfterLessonDelegate: AdAfterLessonDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    startLesson: () => void,
  ) {
    this.observer = observer;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.observableScreen = observableScreen;
    this.reviewIterator = reviewIterator;
    this.reviewFeedbackBarDelegate = reviewFeedbackBarDelegate;
    this.saveResultDelegate = saveResultDelegate;
    this.speakDelegate = speakDelegate;
    this.adDelegate = adDelegate;
    this.adAfterLessonDelegate = adAfterLessonDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.startLesson = startLesson;
  }

  public disableAllButtons(): void {
    this.observableScreen.reviewActionBarState.buttons.forEach(
      (button): void => {
        button.disabled = true;
      },
    );
  }

  public setUpActionButtons(): void {
    const {
      vocabulary,
      currentQuestionType,
      shouldShowAnswer,
    } = this.observableScreen.reviewState;

    this.observableScreen.reviewActionBarState.buttons.replace([
      this.reviewActionButtonFactory.createPreviousButton(
        this.observableScreen.reviewState.currentIndex === 0,
        (): void => this.previousItem(),
      ),
      this.reviewActionButtonFactory.createPlayAudioButton(
        shouldShowAnswer === true || currentQuestionType === 'forward'
          ? vocabulary.vocabularyTerm
          : '',
        vocabulary.vocabularyTerm,
        (): void => {
          this.synthesizeAndSpeak(vocabulary.vocabularyTerm);
        },
      ),
      this.reviewActionButtonFactory.createEditButton(
        (): void => {
          this.navigatorDelegate.push(ScreenName.EDIT_VOCABULARY_SCREEN, {
            originalVocabulary: this.observableScreen.reviewState.vocabulary.toRaw(),
            onSave: (newVocabulary): void => {
              const observableVocabulary = this.observableConverter.convertToObservableVocabulary(
                newVocabulary,
              );

              this.observableScreen.reviewState.vocabulary = observableVocabulary;

              this.observableScreen.vocabularyList.set(
                observableVocabulary.vocabularyId,
                observableVocabulary,
              );
              this.reviewIterator.update(
                observableVocabulary.vocabularyId,
                observableVocabulary,
              );
            },
          });
        },
      ),
    ]);
  }

  public showAnswer(): void {
    this.observableScreen.reviewState.shouldShowAnswer = true;
    this.showReviewFeedbackBar();
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
      this.observableScreen.reviewState.vocabulary.vocabularyId,
      feedback,
    );

    this.reviewFeedbackBarDelegate.hide();
    this.nextItem();
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
      lessonType: 'spaced-repetition',
      vocabularyList: this.observableScreen.vocabularyList,
      originalFeedbackList: this.observableScreen.feedbackListState
        .feedbackList,
      onSaveSucceeded: this.updateFeedbackList,
    });
  }

  public saveResult(): void {
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

  public showConfirmQuitLessonDialog(): void {
    this.dialogDelegate.show({
      testID: LightBoxDialogIds.DIALOG,
      message:
        'The lesson result is not yet saved. Are you sure you want to quit?',
      onBackgroundPress: (): void => {
        this.dialogDelegate.dismiss();
      },
      buttonList: [
        {
          testID: LightBoxDialogIds.CLOSE_DIALOG_BTN,
          text: 'NO',
          onPress: (): void => {
            this.dialogDelegate.dismiss();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
        {
          testID: LightBoxDialogIds.OKAY_BTN,
          text: 'YES',
          onPress: (): void => {
            this.dialogDelegate.dismiss();
            this.navigatorDelegate.pop();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
      ],
    });
  }

  public showSavingInProgressDialog(): void {
    this.dialogDelegate.show({
      message:
        'Saving in progress. Please wait until save is completed then try again.',
      showCloseButton: true,
      closeOnTouchOutside: true,
    });
  }

  private previousItem(): void {
    if (this.observableScreen.reviewState.currentIndex > 0) {
      this.disableAllButtons();
      this.observableScreen.reviewState.shouldRunFadeOutAnimation = true;
      this.observer.when(
        (): boolean =>
          this.observableScreen.reviewState.shouldRunFadeOutAnimation === false,
        (): void => {
          const previousItem = this.reviewIterator.previous();
          this.reviewFeedbackBarDelegate.showShowAnswerButton();
          this.observableScreen.reviewState.setUpPreviousItem(previousItem);
          this.setUpActionButtons();
        },
      );
    }
  }

  private nextItem(): void {
    if (this.reviewIterator.isDone()) {
      this.observableScreen.shouldShowAdOrGoogleConsentForm.set(
        this.adDelegate.shouldShowAdOrGoogleConsentForm(),
      );

      this.observableScreen.shouldShowResult.set(true);
      this.saveResult();
    } else {
      this.disableAllButtons();
      this.observableScreen.reviewState.shouldRunFadeOutAnimation = true;
      this.observer.when(
        (): boolean =>
          this.observableScreen.reviewState.shouldRunFadeOutAnimation === false,
        (): void => {
          const nextItem = this.reviewIterator.next();
          this.observableScreen.reviewState.setUpNextItem(nextItem);
          this.reviewFeedbackBarDelegate.showShowAnswerButton();
          this.setUpActionButtons();
        },
      );
    }
  }

  private showReviewFeedbackBar(): void {
    this.reviewFeedbackBarDelegate.showFeedbackButtons(
      this.observableScreen.reviewState.vocabulary,
      this.observableScreen.numberOfFeedbackButtons.get(),
    );
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
          this.showSynthesizeErrorDialog(errorBag);
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

  private showSynthesizeErrorDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag);
  }

  private updateFeedbackList(
    feedbackList: ReadonlyMap<string, Feedback>,
  ): void {
    this.observableScreen.feedbackListState.feedbackList.replace(feedbackList);
  }
}
