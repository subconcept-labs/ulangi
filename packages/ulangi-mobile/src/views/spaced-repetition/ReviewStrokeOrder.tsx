/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableReviewState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { StrokeOrders } from '../vocabulary/StrokeOrders';
import {
  ReviewStrokeOrderStyles,
  darkStyles,
  lightStyles,
} from './ReviewStrokeOrder.style';

export interface ReviewStrokeOrderProps {
  theme: Theme;
  reviewState: ObservableReviewState;
  styles?: {
    light: ReviewStrokeOrderStyles;
    dark: ReviewStrokeOrderStyles;
  };
}

@observer
export class ReviewStrokeOrder extends React.Component<ReviewStrokeOrderProps> {
  public get styles(): ReviewStrokeOrderStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText>
          <DefaultText style={this.styles.title}>Stroke orders</DefaultText>
          <DefaultText style={this.styles.subtitle}>
            {' '}
            (Tap character to show)
          </DefaultText>
        </DefaultText>
        <StrokeOrders
          theme={this.props.theme}
          words={
            this.props.reviewState.strokeOrderForm === 'traditional'
              ? this.props.reviewState.vocabulary.vocabularyExtraFields.traditional[0][0].split(
                  '',
                )
              : this.props.reviewState.strokeOrderForm === 'simplified'
              ? this.props.reviewState.vocabulary.vocabularyExtraFields.simplified[0][0].split(
                  '',
                )
              : this.props.reviewState.vocabulary.vocabularyTerm.split('')
          }
        />
        {this.renderChangeStrokOrderButton()}
      </View>
    );
  }

  private renderChangeStrokOrderButton(): React.ReactElement<any> {
    return (
      <View>
        {this.props.reviewState.strokeOrderForm === 'unknown' &&
        this.props.reviewState.vocabulary.vocabularyExtraFields.traditional
          .length > 0 ? (
          <TouchableOpacity
            onPress={(): void => {
              this.props.reviewState.strokeOrderForm = 'traditional';
            }}>
            <DefaultText style={this.styles.button_text}>
              View traditional
            </DefaultText>
          </TouchableOpacity>
        ) : null}
        {this.props.reviewState.strokeOrderForm === 'unknown' &&
        this.props.reviewState.vocabulary.vocabularyExtraFields.simplified
          .length > 0 ? (
          <TouchableOpacity
            onPress={(): void => {
              this.props.reviewState.strokeOrderForm = 'simplified';
            }}>
            <DefaultText style={this.styles.button_text}>
              View simplified
            </DefaultText>
          </TouchableOpacity>
        ) : null}
        {this.props.reviewState.strokeOrderForm !== 'unknown' ? (
          <TouchableOpacity
            onPress={(): void => {
              this.props.reviewState.strokeOrderForm = 'unknown';
            }}>
            <DefaultText style={this.styles.button_text}>Back</DefaultText>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}
