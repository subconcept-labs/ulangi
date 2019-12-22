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
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { ReviewTopStyles, darkStyles, lightStyles } from './ReviewTop.style';

export interface ReviewTopProps {
  theme: Theme;
  reviewState: ObservableReviewState;
  styles?: {
    light: ReviewTopStyles;
    dark: ReviewTopStyles;
  };
}

@observer
export class ReviewTop extends React.Component<ReviewTopProps> {
  public get styles(): ReviewTopStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.number_container}>
          <DefaultText style={this.styles.number}>{`${this.props.reviewState
            .currentIndex + 1}/${this.props.reviewState.total}`}</DefaultText>
        </View>
        <View style={this.styles.note_container}>
          <DefaultText style={this.styles.note}>
            {this.props.reviewState.vocabulary.hasBeenReviewedBefore === true
              ? 'Last reviewed ' +
                this.props.reviewState.vocabulary.lastLearnedFromNow
              : 'First time reviewing this term'}
          </DefaultText>
        </View>
      </View>
    );
  }
}
