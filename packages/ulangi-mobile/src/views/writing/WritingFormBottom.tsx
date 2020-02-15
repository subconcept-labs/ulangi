/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback, Theme, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import {
  ObservableReviewActionBarState,
  ObservableReviewFeedbackBarState,
  ObservableWritingFormState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { NextButton } from '../review-action/NextButton';
import { ReviewActionBar } from '../review-action/ReviewActionBar';
import { ReviewFeedbackBar } from '../review-feedback/ReviewFeedbackBar';
import {
  WritingFormBottomStyles,
  darkStyles,
  lightStyles,
} from './WritingFormBottom.style';

export interface WritingFormBottomProps {
  theme: Theme;
  writingFormState: ObservableWritingFormState;
  reviewActionBarState: ObservableReviewActionBarState;
  reviewFeedbackBarState: ObservableReviewFeedbackBarState;
  next: () => void;
  showAnswer: () => void;
  setFeedback: (feedback: Feedback) => void;
  styles?: {
    light: WritingFormBottomStyles;
    dark: WritingFormBottomStyles;
  };
}

@observer
export class WritingFormBottom extends React.Component<WritingFormBottomProps> {
  public get styles(): WritingFormBottomStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <ReviewActionBar
          theme={this.props.theme}
          reviewActionBarState={this.props.reviewActionBarState}
        />
        <View style={this.styles.horizontal_line} />
        {this.renderBottomButtons()}
      </View>
    );
  }

  private renderBottomButtons(): null | React.ReactElement<any> {
    const currentVocabulary = this.props.writingFormState.currentQuestion
      .testingVocabulary;

    if (this.props.writingFormState.isCurrentAnswerCorrect === true) {
      if (
        currentVocabulary.vocabularyStatus === VocabularyStatus.ARCHIVED ||
        currentVocabulary.vocabularyStatus === VocabularyStatus.DELETED
      ) {
        return (
          <NextButton
            theme={this.props.theme}
            title={
              currentVocabulary.vocabularyStatus === VocabularyStatus.ARCHIVED
                ? 'This term has been archived. You will not see it again.'
                : 'This term has been deleted. You will not see it again.'
            }
            next={this.props.next}
          />
        );
      } else {
        return (
          <ReviewFeedbackBar
            theme={this.props.theme}
            reviewFeedbackBarState={this.props.reviewFeedbackBarState}
            setFeedback={this.props.setFeedback}
          />
        );
      }
    } else {
      return null;
    }
  }
}
