/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Feedback, Theme } from '@ulangi/ulangi-common/enums';
import { NextReviewData } from '@ulangi/ulangi-common/interfaces';
import { ObservableVocabulary } from '@ulangi/ulangi-observable';
import { ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { ReviewFeedbackItem } from './ReviewFeedbackItem';
import {
  ReviewFeedbackListStyles,
  darkStyles,
  lightStyles,
} from './ReviewFeedbackList.style';

export interface ReviewFeedBackListProps {
  theme: Theme;
  vocabularyList: ObservableMap<string, ObservableVocabulary>;
  feedbackList: ObservableMap<string, Feedback>;
  allNextReviewData: ObservableMap<string, NextReviewData>;
  showFeedbackSelectionMenu: (vocabularyId: string) => void;
  styles?: {
    light: ReviewFeedbackListStyles;
    dark: ReviewFeedbackListStyles;
  };
}

@observer
export class ReviewFeedbackList extends React.Component<
  ReviewFeedBackListProps
> {
  public get styles(): ReviewFeedbackListStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView contentContainerStyle={this.styles.list_content_container}>
        {Array.from(this.props.feedbackList.entries()).map(
          ([vocabularyId, feedback]): React.ReactElement<any> => {
            return (
              <ReviewFeedbackItem
                key={vocabularyId}
                theme={this.props.theme}
                vocabulary={assertExists(
                  this.props.vocabularyList.get(vocabularyId)
                )}
                feedback={feedback}
                nextReviewData={assertExists(
                  this.props.allNextReviewData.get(vocabularyId)
                )}
                showFeedbackSelectionMenu={this.props.showFeedbackSelectionMenu}
              />
            );
          }
        )}
      </ScrollView>
    );
  }
}
