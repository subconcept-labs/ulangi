/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback, Theme } from '@ulangi/ulangi-common/enums';
import { NextReviewData } from '@ulangi/ulangi-common/interfaces';
import { ObservableVocabulary } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { ReviewFeedbackItemIds } from '../../constants/ids/ReviewFeedbackItemIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { LevelNetChange } from '../vocabulary/LevelNetChange';
import {
  ReviewFeedbackItemStyles,
  darkStyles,
  lightStyles,
} from './ReviewFeedbackItem.style';

interface ReviewFeedbackItemProps {
  theme: Theme;
  vocabulary: ObservableVocabulary;
  feedback: Feedback;
  nextReviewData: NextReviewData;
  showFeedbackSelectionMenu: (vocabularyId: string) => void;
  styles?: {
    light: ReviewFeedbackItemStyles;
    dark: ReviewFeedbackItemStyles;
  };
}

@observer
export class ReviewFeedbackItem extends React.Component<
  ReviewFeedbackItemProps
> {
  public get styles(): ReviewFeedbackItemStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.vocabulary_container}>
        <View style={this.styles.vocabulary_text_container}>
          <DefaultText style={this.styles.vocabulary_text}>
            {this.props.vocabulary.vocabularyTerm}
          </DefaultText>
        </View>
        <View style={this.styles.row_container}>
          <View style={this.styles.left_container}>
            <DefaultText style={this.styles.left_text}>
              Your feedback
            </DefaultText>
          </View>
          <View style={this.styles.right_container}>{this.renderButton()}</View>
        </View>
        <View style={this.styles.row_container}>
          <View style={this.styles.left_container}>
            <DefaultText style={this.styles.left_text}>Next level</DefaultText>
          </View>
          <View style={[this.styles.right_container, this.styles.flex_row]}>
            <DefaultText
              testID={ReviewFeedbackItemIds.NEXT_LEVEL_BY_VOCABULARY_TEXT(
                this.props.vocabulary.vocabularyText
              )}
              style={this.styles.right_text}
            >
              {this.props.nextReviewData.nextLevel}
            </DefaultText>
            <LevelNetChange
              style={this.styles.level_net_change}
              netChange={this.props.nextReviewData.netLevelChange}
            />
          </View>
        </View>
        <View style={this.styles.row_container}>
          <View style={this.styles.left_container}>
            <DefaultText style={this.styles.left_text}>Next review</DefaultText>
          </View>
          <View style={this.styles.right_container}>
            <DefaultText
              testID={ReviewFeedbackItemIds.NEXT_REVIEW_BY_VOCABULARY_TEXT(
                this.props.vocabulary.vocabularyText
              )}
              style={this.styles.right_text}
            >
              {this.props.nextReviewData.nextReview}
            </DefaultText>
          </View>
        </View>
      </View>
    );
  }

  private renderButton(): React.ReactElement<any> {
    return (
      <DefaultButton
        testID={ReviewFeedbackItemIds.SHOW_FEEDBACK_SELECTION_MENU_BTN_BY_VOCABULARY_TEXT(
          this.props.vocabulary.vocabularyText
        )}
        text={this.props.feedback}
        styles={LessonScreenStyle.getNormalButtonStyles(
          config.reviewFeedback.feedbackMap[this.props.feedback].color,
          'white'
        )}
        onPress={(): void =>
          this.props.showFeedbackSelectionMenu(
            this.props.vocabulary.vocabularyId
          )
        }
      />
    );
  }
}
