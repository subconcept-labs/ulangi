import { Feedback, Theme, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import {
  ObservableReviewActionBarState,
  ObservableReviewFeedbackBarState,
  ObservableReviewState,
  ObservableScreenLayout,
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
  reviewBottomResponsiveStyles,
} from './ReviewBottom.style';

export interface ReviewButtomProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
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
    return reviewBottomResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <ReviewActionBar
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
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
          screenLayout={this.props.screenLayout}
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
          screenLayout={this.props.screenLayout}
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
          screenLayout={this.props.screenLayout}
          reviewFeedbackBarState={this.props.reviewFeedbackBarState}
          setFeedback={this.props.setFeedback}
        />
      );
    }
  }
}
