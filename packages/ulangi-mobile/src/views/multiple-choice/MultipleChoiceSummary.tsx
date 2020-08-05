/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableMultipleChoiceResult,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  MultipleChoiceSummaryStyles,
  multipleChoiceSummaryResponsiveStyles,
} from './MultipleChoiceSummary.style';

export interface MultipleChoiceSummaryProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  multipleChoiceResult: ObservableMultipleChoiceResult;
  styles?: {
    light: MultipleChoiceSummaryStyles;
    dark: MultipleChoiceSummaryStyles;
  };
}

@observer
export class MultipleChoiceSummary extends React.Component<
  MultipleChoiceSummaryProps
> {
  public get styles(): MultipleChoiceSummaryStyles {
    return multipleChoiceSummaryResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.stats_container}>
        <View style={this.styles.row}>
          <View style={this.styles.left}>
            <DefaultText style={this.styles.text_left}>
              Correct attempt(s):
            </DefaultText>
          </View>
          <View style={this.styles.right}>
            <DefaultText style={this.styles.text_right}>
              {this.props.multipleChoiceResult.correctAttempts}
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.row}>
          <View style={this.styles.left}>
            <DefaultText style={this.styles.text_left}>
              Incorrect attempt(s):
            </DefaultText>
          </View>
          <View style={this.styles.right}>
            <DefaultText style={this.styles.text_right}>
              {this.props.multipleChoiceResult.incorrectAttempts}
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.horizontal_line} />
        <View style={this.styles.result_container}>
          <View style={this.styles.result_row}>
            <DefaultText style={this.styles.percentage}>
              {this.props.multipleChoiceResult.correctPercentage === null
                ? 'N/A'
                : this.props.multipleChoiceResult.correctPercentage +
                  '% of the attempts are correct'}
            </DefaultText>
          </View>
          <View style={this.styles.result_row}>
            <DefaultText style={this.styles.grade}>
              {typeof this.props.multipleChoiceResult.grade !== 'undefined'
                ? 'Grade ' + this.props.multipleChoiceResult.grade
                : 'N/A'}
            </DefaultText>
          </View>
        </View>
      </View>
    );
  }
}
