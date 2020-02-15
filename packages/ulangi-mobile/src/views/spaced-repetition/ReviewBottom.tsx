import { Feedback, Theme, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import {
  ObservableReviewActionBarState,
  ObservableReviewFeedbackBarState,
  ObservableReviewState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { NextButton } from '../review-action/NextButton';
import { ReviewActionBar } from '../review-action/ReviewActionBar';
import { ShowAnswerButton } from '../review-action/ShowAnswerButton';
import { ReviewFeedbackBar } from '../review-feedback/ReviewFeedbackBar';
import {
  ReviewBottomStyles,
  darkStyles,
  lightStyles,
} from './ReviewBottom.style';

export interface ReviewButtomProps {
  theme: Theme;
  reviewState: ObservableReviewState;
  reviewActionBarState: ObservableReviewActionBarState;
  reviewFeedbackBarState: ObservableReviewFeedbackBarState;
  next: () => void;
  showAnswer: () => void;
  setFeedback: (feedback: Feedback) => void;
  styles?: {
    light: ReviewBottomStyles;
    dark: ReviewBottomStyles;
  };
}

@observer
export class ReviewBottom extends React.Component<ReviewButtomProps> {
  private get styles(): ReviewBottomStyles {
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

  private renderBottomButtons(): React.ReactElement<any> {
    const currentVocabulary = this.props.reviewState.vocabulary;

    if (this.props.reviewState.shouldShowAnswer === false) {
      return (
        <ShowAnswerButton
          theme={this.props.theme}
          showAnswer={this.props.showAnswer}
        />
      );
    } else if (
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
  }
}
