/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyExtraFieldDetails } from '@ulangi/ulangi-common/constants';
import {
  ActivityState,
  ButtonSize,
  Feedback,
  ScreenName,
  ScreenState,
} from '@ulangi/ulangi-common/enums';
import { VocabularyExtraFields } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableReviewActionButton,
  ObservableSetStore,
  ObservableSpacedRepetitionLessonScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';
import { BackHandler } from 'react-native';

import { Images } from '../../constants/Images';
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ReviewActionBarIds } from '../../constants/ids/ReviewActionBarIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { ReviewIterator } from '../../iterators/ReviewIterator';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { AdAfterLessonDelegate } from '../ad/AdAfterLessonDelegate';
import { AdDelegate } from '../ad/AdDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { ReviewFeedbackBarDelegate } from '../review-feedback/ReviewFeedbackBarDelegate';
import { SpeakDelegate } from '../vocabulary/SpeakDelegate';
import { SpacedRepetitionSaveResultDelegate } from './SpacedRepetitionSaveResultDelegate';

@boundClass
export class SpacedRepetitionLessonScreenDelegate {
  private errorConverter = new ErrorConverter();

  private observer: Observer;
  private setStore: ObservableSetStore;
  private observableScreen: ObservableSpacedRepetitionLessonScreen;
  private reviewIterator: ReviewIterator;
  private reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate;
  private saveResultDelegate: SpacedRepetitionSaveResultDelegate;
  private speakDelegate: SpeakDelegate;
  private adDelegate: AdDelegate;
  private adAfterLessonDelegate: AdAfterLessonDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private startLesson: () => void;

  public constructor(
    observer: Observer,
    setStore: ObservableSetStore,
    observableScreen: ObservableSpacedRepetitionLessonScreen,
    reviewIterator: ReviewIterator,
    reviewFeedbackBarDelegate: ReviewFeedbackBarDelegate,
    saveResultDelegate: SpacedRepetitionSaveResultDelegate,
    speakDelegate: SpeakDelegate,
    adDelegate: AdDelegate,
    adAfterLessonDelegate: AdAfterLessonDelegate,
    navigatorDelegate: NavigatorDelegate,
    startLesson: () => void
  ) {
    this.observer = observer;
    this.setStore = setStore;
    this.observableScreen = observableScreen;
    this.reviewIterator = reviewIterator;
    this.reviewFeedbackBarDelegate = reviewFeedbackBarDelegate;
    this.saveResultDelegate = saveResultDelegate;
    this.speakDelegate = speakDelegate;
    this.adDelegate = adDelegate;
    this.adAfterLessonDelegate = adAfterLessonDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.startLesson = startLesson;
  }

  public disableAllButtons(): void {
    this.observableScreen.reviewActionBarState.buttons.forEach(
      (button): void => {
        button.disabled = true;
      }
    );
  }

  public setUpButtons(): void {
    const vocabulary = this.observableScreen.reviewState.vocabulary;

    this.observableScreen.reviewActionBarState.buttons.replace([
      new ObservableReviewActionButton(
        'PREVIOUS',
        undefined,
        ReviewActionBarIds.PREVIOUS_BTN,
        {
          light: Images.ARROW_LEFT_BLACK_25X25,
          dark: Images.ARROW_LEFT_MILK_25X25,
        },
        this.observableScreen.reviewState.currentIndex === 0,
        (): void => this.previousItem()
      ),
      new ObservableReviewActionButton(
        'SHOW ANSWER',
        undefined,
        ReviewActionBarIds.SHOW_ANSWER_BTN,
        {
          light: Images.EYE_BLACK_25X19,
          dark: Images.EYE_MILK_25X19,
        },
        false,
        (self): void => {
          this.showDefinitions();
          self.reset(
            'NEXT',
            undefined,
            ReviewActionBarIds.NEXT_BTN,
            {
              light: Images.ARROW_RIGHT_BLACK_25X25,
              dark: Images.ARROW_RIGHT_MILK_25X25,
            },
            false,
            (): void => {
              this.showReviewFeedbackBar();
            }
          );
        }
      ),
      new ObservableReviewActionButton(
        'PLAY AUDIO',
        vocabulary.vocabularyTerm,
        ReviewActionBarIds.PLAY_AUDIO_BTN_BY_VALUE(vocabulary.vocabularyTerm),
        {
          light: Images.SPEAKER_BLACK_23X23,
          dark: Images.SPEAKER_MILK_23X23,
        },
        false,
        (): void => {
          this.synthesizeAndSpeak(vocabulary.vocabularyTerm);
        },
        this.autoUpdateAudioButton
      ),
    ]);

    {
      _.toPairs(vocabulary.vocabularyExtraFields).forEach(
        ([key, valueList]): void => {
          if (
            VocabularyExtraFieldDetails[key as keyof VocabularyExtraFields]
              .params[0].isSpeakable === true
          ) {
            valueList.forEach(
              (values: string[]): void => {
                this.observableScreen.reviewActionBarState.buttons.push(
                  new ObservableReviewActionButton(
                    `PLAY AUDIO`,
                    values[0],
                    ReviewActionBarIds.PLAY_AUDIO_BTN_BY_VALUE(values[0]),
                    {
                      light: Images.SPEAKER_BLACK_23X23,
                      dark: Images.SPEAKER_MILK_23X23,
                    },
                    false,
                    (): void => this.synthesizeAndSpeak(values[0]),
                    this.autoUpdateAudioButton
                  )
                );
              }
            );
          }
        }
      );
    }
  }

  public autoUpdateButtons(): void {
    this.observer.autorun(
      (): void => {
        this.observableScreen.reviewActionBarState.buttons.forEach(
          (button): void => {
            if (typeof button.autorun !== 'undefined') {
              button.autorun(button);
            }
          }
        );
      }
    );
  }

  public setFeedback(feedback: Feedback): void {
    this.observableScreen.feedbackListState.feedbackList.set(
      this.observableScreen.reviewState.vocabulary.vocabularyId,
      feedback
    );

    this.reviewFeedbackBarDelegate.hide(
      (): void => {
        this.nextItem();
      }
    );
  }

  public takeAnotherLesson(): void {
    this.quit();
    this.observer.when(
      (): boolean =>
        this.observableScreen.screenState === ScreenState.UNMOUNTED,
      (): void => this.startLesson()
    );
  }

  public quit(): void {
    if (this.observableScreen.shouldShowAdOrGoogleConsentForm.get()) {
      this.adAfterLessonDelegate.showAdOrGoogleConsentForm(
        (): void => this.navigatorDelegate.pop()
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
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
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
              ButtonSize.SMALL
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
              ButtonSize.SMALL
            ),
          },
        ],
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public showSavingInProgressDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message:
          'Saving in progress. Please wait until save is completed then try again.',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
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
          this.observableScreen.reviewState.setUpPreviousItem(previousItem);
          this.setUpButtons();
        }
      );
    }
  }

  private nextItem(): void {
    if (this.reviewIterator.isDone()) {
      this.observableScreen.shouldShowAdOrGoogleConsentForm.set(
        this.adDelegate.shouldShowAdOrGoogleConsentForm()
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
          this.setUpButtons();
        }
      );
    }
  }

  private autoUpdateAudioButton(button: ObservableReviewActionButton): void {
    if (this.observableScreen.speakState.get() === ActivityState.ACTIVE) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }

  private showDefinitions(): void {
    this.observableScreen.reviewState.shouldShowDefinitions = true;
  }

  private showReviewFeedbackBar(): void {
    this.reviewFeedbackBarDelegate.show(
      this.observableScreen.reviewState.vocabulary
    );
  }

  private synthesizeAndSpeak(text: string): void {
    const filePath = this.speakDelegate.getAudioFilePath(text);

    if (typeof filePath !== 'undefined') {
      this.speak(filePath);
    } else {
      this.speakDelegate.synthesize(
        text,
        this.setStore.existingCurrentSet.learningLanguageCode,
        {
          onSynthesizing: (): void => {
            this.observableScreen.speakState.set(ActivityState.ACTIVE);
          },
          onSynthesizeSucceeded: (filePath): void => {
            this.observableScreen.speakState.set(ActivityState.INACTIVE);
            this.speak(filePath);
          },
          onSynthesizeFailed: (errorCode): void => {
            this.observableScreen.speakState.set(ActivityState.INACTIVE);
            this.showSynthesizeErrorDialog(errorCode);
          },
        }
      );
    }
  }

  private speak(filePath: string): void {
    this.speakDelegate.speak(filePath, {
      onSpeakSucceeded: (): void => {
        this.observableScreen.speakState.set(ActivityState.INACTIVE);
      },
      onSpeakFailed: (): void => {
        this.observableScreen.speakState.set(ActivityState.INACTIVE);
      },
    });
  }

  private showSynthesizeErrorDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        message: this.errorConverter.convertToMessage(errorCode),
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  private updateFeedbackList(
    feedbackList: ReadonlyMap<string, Feedback>
  ): void {
    this.observableScreen.feedbackListState.feedbackList.replace(feedbackList);
  }
}
