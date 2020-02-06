/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableReviewActionBarState,
  ObservableReviewFeedbackBarState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { ReviewActionBar } from '../review-action/ReviewActionBar';
import { ReviewFeedbackBar } from '../review-feedback/ReviewFeedbackBar';
import {
  WritingFormBottomStyles,
  darkStyles,
  lightStyles,
} from './WritingFormBottom.style';

export interface WritingFormBottomProps {
  theme: Theme;
  reviewActionBarState: ObservableReviewActionBarState;
  reviewFeedbackBarState: ObservableReviewFeedbackBarState;
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
