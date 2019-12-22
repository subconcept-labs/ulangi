/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { LightBoxState, ScreenName } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableLightBox,
  ObservableReflexScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { boundClass } from 'autobind-decorator';

import { config } from '../../constants/config';
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { ReflexQuestionIterator } from '../../iterators/ReflexQuestionIterator';
import { ReflexStyle } from '../../styles/ReflexStyle';
import { CategoryMessageDelegate } from '../category/CategoryMessageDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { FetchVocabularyDelegate } from './FetchVocabularyDelegate';
import { TimerDelegate } from './TimerDelegate';

@boundClass
export class ReflexScreenDelegate {
  private errorConverter = new ErrorConverter();

  private observer: Observer;
  private observableLightBox: ObservableLightBox;
  private observableScreen: ObservableReflexScreen;
  private questionIterator: ReflexQuestionIterator;
  private fetchVocabularyDelegate: FetchVocabularyDelegate;
  private timerDelegate: TimerDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private categoryMessageDelegate: CategoryMessageDelegate;
  private analytics: AnalyticsAdapter;

  public constructor(
    observer: Observer,
    observableLightBox: ObservableLightBox,
    observableScreen: ObservableReflexScreen,
    questionIterator: ReflexQuestionIterator,
    fetchVocabularyDelegate: FetchVocabularyDelegate,
    timerDelegate: TimerDelegate,
    navigatorDelegate: NavigatorDelegate,
    categoryMessageDelegate: CategoryMessageDelegate,
    analytics: AnalyticsAdapter
  ) {
    this.observer = observer;
    this.observableLightBox = observableLightBox;
    this.observableScreen = observableScreen;
    this.questionIterator = questionIterator;
    this.fetchVocabularyDelegate = fetchVocabularyDelegate;
    this.timerDelegate = timerDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.categoryMessageDelegate = categoryMessageDelegate;
    this.analytics = analytics;
  }

  public startGame(): void {
    this.analytics.logEvent('start_reflex');
    this.fetchVocabularyDelegate.prepareFetch({
      onPreparing: this.showPreparingDialog,
      onPrepareSucceeded: (): void => {
        this.fetchVocabularyDelegate.fetch({
          onFetchSucceeded: (vocabularyList, noMore): void => {
            this.addVocabularyToQueueAndShuffle(vocabularyList);
            this.observableScreen.noMoreVocabulary = noMore;

            if (this.questionIterator.getNumberOfQuestionLeft() === 0) {
              this.showNoVocabularyLightBox();
              this.clearFetchVocabulary();
            } else {
              this.navigatorDelegate.dismissLightBox();
              this.observer.when(
                (): boolean =>
                  this.observableLightBox.state === LightBoxState.UNMOUNTED,
                (): void => {
                  this.disablePopGesture();
                  this.observableScreen.gameState.started = true;
                  this.next();
                }
              );
            }
          },
          onFetchFailed: (errorCode): void => {
            this.clearFetchVocabulary();
            this.showPrepareFailedDialog(errorCode);
          },
        });
      },
      onPrepareFailed: (errorCode): void => {
        this.clearFetchVocabulary();
        this.showPrepareFailedDialog(errorCode);
      },
    });
  }

  public clearGame(): void {
    this.clearFetchVocabulary();
  }

  public pause(): void {
    this.timerDelegate.stopTimer();
    this.showPausedLightBox();
  }

  public quit(): void {
    this.navigatorDelegate.dismissLightBox();
    this.navigatorDelegate.pop();
  }

  public continue(): void {
    this.navigatorDelegate.dismissLightBox();
    this.timerDelegate.startTimer({
      onTimeUp: this.handleTimeUp,
    });
  }

  public restart(): void {
    this.timerDelegate.stopAndResetTimer();
    this.observableScreen.gameState.reset(
      false,
      config.reflex.timePerQuestion,
      false
    );
    this.observableScreen.gameStats.reset(0);
    this.questionIterator.reset();

    this.navigatorDelegate.dismissLightBox();
    this.observer.when(
      (): boolean => this.observableLightBox.state === LightBoxState.UNMOUNTED,
      (): void => {
        this.clearFetchVocabulary();
        this.startGame();
      }
    );
  }

  public handleSelectAnswer(answer: 'YES' | 'NO'): void {
    this.timerDelegate.stopTimer();

    const question = assertExists(
      this.observableScreen.gameState.currentQuestion,
      'currentQuestion should not be null or undefined'
    );
    if (
      answer === 'YES' &&
      question.correctMeaning === question.randomMeaning
    ) {
      this.handleAnswerCorrect();
    } else if (
      answer === 'NO' &&
      question.correctMeaning !== question.randomMeaning
    ) {
      this.handleAnswerCorrect();
    } else {
      this.gameOver('Wrong Answer!');
    }
  }

  public handleIconPressed(): void {
    if (this.observableScreen.gameState.started === true) {
      this.pause();
    } else {
      this.navigatorDelegate.pop();
    }
  }

  public showSelectSpecificCategoryMessage(): void {
    this.categoryMessageDelegate.showSelectSpecificCategoryMessage();
  }

  private disablePopGesture(): void {
    this.navigatorDelegate.mergeOptions({
      popGesture: false,
    });
  }

  private clearFetchVocabulary(): void {
    this.observableScreen.noMoreVocabulary = false;
    this.fetchVocabularyDelegate.clearFetch();
  }

  private handleAnswerCorrect(): void {
    this.observableScreen.gameStats.score =
      this.observableScreen.gameStats.score + 1;

    this.next();
  }

  private next(): void {
    if (!this.questionIterator.isDone()) {
      this.observableScreen.gameState.currentQuestion = this.questionIterator.next();

      this.timerDelegate.stopAndResetTimer();
      this.timerDelegate.startTimer({
        onTimeUp: this.handleTimeUp,
      });
    } else {
      if (this.observableScreen.noMoreVocabulary === true) {
        this.gameOver('No More Vocabulary!');
      } else {
        this.showWaitingLightBox();
      }
    }

    if (this.observableScreen.noMoreVocabulary === false) {
      this.fetchVocabularyDelegate.fetchVocabularyIfBelowThreshold({
        onFetchSucceeded: (vocabularyList, noMore): void => {
          this.addVocabularyToQueueAndShuffle(vocabularyList);
          this.observableScreen.noMoreVocabulary = noMore;

          if (this.observableScreen.gameState.waitingForFetching === true) {
            this.dismissWaitingDialogAndNext();
          }
        },
      });
    }
  }

  private handleTimeUp(): void {
    this.gameOver("Time's Up!");
  }

  private gameOver(title: string): void {
    this.timerDelegate.stopTimer();
    this.showGameOverLightBox(title);
  }

  private addVocabularyToQueueAndShuffle(
    vocabularyList: readonly Vocabulary[]
  ): void {
    // add new vocabulary to queue
    this.questionIterator.merge(
      new Map(
        vocabularyList.map(
          (vocabulary): [string, Vocabulary] => [
            vocabulary.vocabularyId,
            vocabulary,
          ]
        )
      )
    );
    this.questionIterator.shuffleQueue();
  }

  private dismissWaitingDialogAndNext(): void {
    this.observableScreen.gameState.waitingForFetching = false;
    this.navigatorDelegate.dismissLightBox();

    this.observer.when(
      (): boolean => this.observableLightBox.state === LightBoxState.UNMOUNTED,
      (): void => {
        this.next();
      }
    );
  }

  private showWaitingLightBox(): void {
    this.observableScreen.gameState.waitingForFetching = true;
    this.navigatorDelegate.showDialog(
      {
        title: 'FETCHING VOCABULARY',
        message: 'Fetching more vocabulary. Please wait...',
      },
      ReflexStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  private showPausedLightBox(): void {
    this.navigatorDelegate.showLightBox(
      ScreenName.REFLEX_PAUSED_SCREEN,
      {
        continue: this.continue,
        restart: this.restart,
        quit: this.quit,
      },
      ReflexStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  private showGameOverLightBox(title: string): void {
    this.navigatorDelegate.showLightBox(
      ScreenName.REFLEX_GAME_OVER_SCREEN,
      {
        title,
        score: this.observableScreen.gameStats.score,
        restart: this.restart,
        quit: this.quit,
      },
      ReflexStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  private showNoVocabularyLightBox(): void {
    this.navigatorDelegate.showDialog(
      {
        title: 'FAILED TO START',
        message: 'No vocabulary available to play. Please add some vocabulary.',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      ReflexStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  private showPreparingDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Preparing. Please wait...',
      },
      ReflexStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  private showPrepareFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message: this.errorConverter.convertToMessage(errorCode),
        title: 'FAILED TO START',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      ReflexStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }
}
