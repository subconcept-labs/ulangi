import { Feedback, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableReviewActionBarState,
  ObservableReviewFeedbackBarState,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { View } from 'react-native';

import { ReviewActionBar } from '../review-action/ReviewActionBar';
import { ReviewFeedbackBar } from '../review-feedback/ReviewFeedbackBar';
import {
  ReviewBottomStyles,
  darkStyles,
  lightStyles,
} from './ReviewBottom.style';

export interface ReviewButtomProps {
  theme: Theme;
  reviewActionBarState: ObservableReviewActionBarState;
  reviewFeedbackBarState: ObservableReviewFeedbackBarState;
  showAnswer: () => void;
  setFeedback: (feedback: Feedback) => void;
  styles?: {
    light: ReviewBottomStyles;
    dark: ReviewBottomStyles;
  };
}

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
        <ReviewFeedbackBar
          theme={this.props.theme}
          reviewFeedbackBarState={this.props.reviewFeedbackBarState}
          showAnswer={this.props.showAnswer}
          setFeedback={this.props.setFeedback}
        />
      </View>
    );
  }
}
