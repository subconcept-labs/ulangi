/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableReviewFeedbackBarState } from '@ulangi/ulangi-observable';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { ReviewFeedbackBarIds } from '../../constants/ids/ReviewFeedbackBarIds';
import { DefaultText } from '../common/DefaultText';
import {
  ReviewFeedbackBarStyles,
  darkStyles,
  lightStyles,
} from './ReviewFeedbackBar.style';

export interface ReviewFeedbackBarProps {
  theme: Theme;
  reviewFeedbackBarState: ObservableReviewFeedbackBarState;
  setFeedback: (feedback: Feedback) => void;
  styles?: {
    light: ReviewFeedbackBarStyles;
    dark: ReviewFeedbackBarStyles;
  };
}

@observer
export class ReviewFeedbackBar extends React.Component<ReviewFeedbackBarProps> {
  private animationContainerRef?: any;
  private unsubscribeAnimation?: () => void;

  public componentDidMount(): void {
    this.unsubscribeAnimation = autorun(
      (): void => {
        if (
          this.props.reviewFeedbackBarState.shouldRunCloseAnimation &&
          this.animationContainerRef
        ) {
          this.animationContainerRef.fadeOutDown(200).then(
            (): void => {
              this.props.reviewFeedbackBarState.shouldShow = false;
              this.props.reviewFeedbackBarState.shouldRunCloseAnimation = false;
            },
          );
        }
      },
    );
  }

  public componentWillUnmount(): void {
    if (this.unsubscribeAnimation) {
      this.unsubscribeAnimation();
    }
  }

  public get styles(): ReviewFeedbackBarStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): null | React.ReactElement<any> {
    if (this.props.reviewFeedbackBarState.shouldShow === false) {
      return null;
    } else {
      return (
        <Animatable.View
          style={this.styles.container}
          ref={(ref: any): void => {
            this.animationContainerRef = ref;
          }}
          animation="slideInUp"
          duration={config.general.animationDuration}
          useNativeDriver={true}>
          <View style={this.styles.title_container}>
            <DefaultText style={this.styles.title}>
              How well do you memorize it?
            </DefaultText>
            <DefaultText style={this.styles.subtitle}>
              Select the next review time for this term.
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
                          config.reviewFeedback.feedbackMap[
                            feedback as Feedback
                          ].color,
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
                      style={[
                        this.styles.level_text,
                        {
                          color: '#fff',
                        },
                      ]}>
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
}
