/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { Feedback, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableFeedbackListState,
  ObservableReviewFeedbackScreen,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { ReviewFeedbackScreenIds } from '../../constants/ids/ReviewFeedbackScreenIds';
import { ReviewFeedbackScreenFactory } from '../../factories/review-feedback/ReviewFeedbackScreenFactory';
import { ReviewFeedbackScreen } from './ReviewFeedbackScreen';
import { ReviewFeedbackScreenStyle } from './ReviewFeedbackScreenContainer.style';

export interface WritingReviewFeedbackScreenPassedProps {
  lessonType: 'spaced-repetition' | 'writing';
  vocabularyList: ReadonlyMap<string, Vocabulary>;
  originalFeedbackList: ReadonlyMap<string, Feedback>;
  onSaveSucceeded: (feedbackList: ReadonlyMap<string, Feedback>) => void;
}

@observer
export class ReviewFeedbackScreenContainer extends Container<
  WritingReviewFeedbackScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ReviewFeedbackScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ReviewFeedbackScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private reviewFeedbackScreenFactory = new ReviewFeedbackScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private reviewFeedbackDataDelegate = this.reviewFeedbackScreenFactory.createReviewFeedbackDataDelegate(
    this.props.passedProps.lessonType
  );

  protected observableScreen = new ObservableReviewFeedbackScreen(
    observable.map(
      Array.from(this.props.passedProps.vocabularyList.entries()).map(
        ([vocabularyId, vocabulary]): [string, ObservableVocabulary] => {
          return [
            vocabularyId,
            this.props.observableConverter.convertToObservableVocabulary(
              vocabulary
            ),
          ];
        }
      )
    ),
    new ObservableFeedbackListState(
      observable.map(
        Array.from(this.props.passedProps.originalFeedbackList.entries())
      )
    ),
    this.reviewFeedbackDataDelegate.createAllNextReviewData(
      this.props.passedProps.vocabularyList,
      this.props.passedProps.originalFeedbackList
    ),
    ScreenName.REVIEW_FEEDBACK_SCREEN
  );

  private navigatorDelegate = this.reviewFeedbackScreenFactory.createNavigatorDelegate();

  private screenDelegate = this.reviewFeedbackScreenFactory.createScreenDelegate(
    this.props.passedProps.lessonType,
    this.observableScreen
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === ReviewFeedbackScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === ReviewFeedbackScreenIds.SAVE_BTN) {
      this.screenDelegate.saveResult({
        onSaveSucceeded: this.props.passedProps.onSaveSucceeded,
      });
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ReviewFeedbackScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ReviewFeedbackScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ReviewFeedbackScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
