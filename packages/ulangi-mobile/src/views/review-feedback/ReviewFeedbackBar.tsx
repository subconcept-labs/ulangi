/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableReviewFeedbackBarState,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { ReviewFeedbackBarIds } from '../../constants/ids/ReviewFeedbackBarIds';
import { DefaultText } from '../common/DefaultText';
import {
  ReviewFeedbackBarStyles,
  reviewFeedbackBarResponsiveStyles,
} from './ReviewFeedbackBar.style';

export interface ReviewFeedbackBarProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  reviewFeedbackBarState: ObservableReviewFeedbackBarState;
  setFeedback: (feedback: Feedback) => void;
}

@observer
export class ReviewFeedbackBar extends React.Component<ReviewFeedbackBarProps> {
  private get styles(): ReviewFeedbackBarStyles {
    return reviewFeedbackBarResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Animatable.View
        animation="fadeIn"
        useNativeDriver
        duration={config.general.animationDuration}
        style={this.styles.container}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>
            How well do you memorize it?
          </DefaultText>
        </View>
        <View style={this.styles.feedback_container}>
          {Array.from(
            this.props.reviewFeedbackBarState.nextReviewByFeedback.entries(),
          ).map(
            ([feedback, nextReviewData]): React.ReactElement<any> => {
              return (
                <TouchableOpacity
                  key={feedback}
                  testID={ReviewFeedbackBarIds.SELECT_FEEDBACK_BTN_BY_FEEDBACK(
                    feedback,
                  )}
                  style={[
                    this.styles.feedback_btn,
                    {
                      backgroundColor:
                        config.reviewFeedback.feedbackMap[feedback as Feedback]
                          .color,
                    },
                  ]}
                  onPress={(): void =>
                    this.props.setFeedback(feedback as Feedback)
                  }>
                  <DefaultText
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    style={this.styles.feedback_text}>
                    {feedback.toUpperCase()}
                  </DefaultText>
                  <DefaultText
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    style={this.styles.time_text}>
                    {nextReviewData.nextReview}
                  </DefaultText>
                  <DefaultText
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    style={this.styles.level_text}>
                    lv. {nextReviewData.nextLevel}
                  </DefaultText>
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </Animatable.View>
    );
  }
}
