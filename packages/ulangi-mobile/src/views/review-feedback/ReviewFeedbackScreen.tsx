/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableReviewFeedbackScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ReviewFeedbackScreenIds } from '../../constants/ids/ReviewFeedbackScreenIds';
import { ReviewFeedbackScreenDelegate } from '../../delegates/review-feedback/ReviewFeedbackScreenDelegate';
import { Screen } from '../common/Screen';
import { ReviewFeedbackList } from '../review-feedback/ReviewFeedbackList';
import {
  ReviewFeedbackScreenStyles,
  reviewFeedbackScreenResponsiveStyles,
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
    return reviewFeedbackScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={ReviewFeedbackScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <ReviewFeedbackList
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          vocabularyList={this.props.observableScreen.vocabularyList}
          feedbackList={
            this.props.observableScreen.feedbackListState.feedbackList
          }
          allNextReviewData={this.props.observableScreen.allNextReviewData}
          showFeedbackSelectionMenu={(vocabularyId): void =>
            this.props.screenDelegate.showFeedbackSelectionMenu(vocabularyId)
          }
        />
      </Screen>
    );
  }
}
