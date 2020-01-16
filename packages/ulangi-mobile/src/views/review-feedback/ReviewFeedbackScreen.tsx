/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableReviewFeedbackScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { ReviewFeedbackScreenIds } from '../../constants/ids/ReviewFeedbackScreenIds';
import { ReviewFeedbackScreenDelegate } from '../../delegates/review-feedback/ReviewFeedbackScreenDelegate';
import { ReviewFeedbackList } from '../review-feedback/ReviewFeedbackList';
import {
  ReviewFeedbackScreenStyles,
  darkStyles,
  lightStyles,
} from './ReviewFeedbackScreen.style';

export interface ReviewFeedbackScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableReviewFeedbackScreen;
  screenDelegate: ReviewFeedbackScreenDelegate;
}

@observer
export class ReviewFeedbackScreen extends React.Component<
  ReviewFeedbackScreenProps
> {
  public get styles(): ReviewFeedbackScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={ReviewFeedbackScreenIds.SCREEN}>
        <ReviewFeedbackList
          theme={this.props.themeStore.theme}
          vocabularyList={this.props.observableScreen.vocabularyList}
          feedbackList={
            this.props.observableScreen.feedbackListState.feedbackList
          }
          allNextReviewData={this.props.observableScreen.allNextReviewData}
          showFeedbackSelectionMenu={(vocabularyId): void =>
            this.props.screenDelegate.showFeedbackSelectionMenu(vocabularyId)
          }
        />
      </View>
    );
  }
}
