/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableFeedbackListState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  ReviewFeedbackSummaryStyles,
  darkStyles,
  lightStyles,
} from './ReviewFeedbackSummary.style';

export interface ReviewFeedbackSummaryProps {
  theme: Theme;
  feedbackListState: ObservableFeedbackListState;
  styles?: {
    light: ReviewFeedbackSummaryStyles;
    dark: ReviewFeedbackSummaryStyles;
  };
}

@observer
export class ReviewFeedbackSummary extends React.Component<
  ReviewFeedbackSummaryProps
> {
  public get styles(): ReviewFeedbackSummaryStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.stats_container}>
        <View style={this.styles.row}>
          <View style={this.styles.row_left}>
            <DefaultText style={this.styles.text_left}>Poor:</DefaultText>
          </View>
          <View style={this.styles.row_right}>
            <DefaultText style={this.styles.text_right}>
              {this.props.feedbackListState.numOfPoor}
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.row}>
          <View style={this.styles.row_left}>
            <DefaultText style={this.styles.text_left}>Fair:</DefaultText>
          </View>
          <View style={this.styles.row_right}>
            <DefaultText style={this.styles.text_right}>
              {this.props.feedbackListState.numOfFair}
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.row}>
          <View style={this.styles.row_left}>
            <DefaultText style={this.styles.text_left}>Good:</DefaultText>
          </View>
          <View style={this.styles.row_right}>
            <DefaultText style={this.styles.text_right}>
              {this.props.feedbackListState.numOfGood}
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.row}>
          <View style={this.styles.row_left}>
            <DefaultText style={this.styles.text_left}>Great:</DefaultText>
          </View>
          <View style={this.styles.row_right}>
            <DefaultText style={this.styles.text_right}>
              {this.props.feedbackListState.numOfGreat}
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.row}>
          <View style={this.styles.row_left}>
            <DefaultText style={this.styles.text_left}>Superb:</DefaultText>
          </View>
          <View style={this.styles.row_right}>
            <DefaultText style={this.styles.text_right}>
              {this.props.feedbackListState.numOfSuperb}
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.horizontal_line} />
      </View>
    );
  }
}
