/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableFeedbackListState } from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { config } from '../../constants/config';
import { SpacedRepetitionLessonScreenIds } from '../../constants/ids/SpacedRepetitionLessonScreenIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { AdNotice } from '../ad/AdNotice';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { ReviewFeedbackSummary } from '../review-feedback/ReviewFeedbackSummary';
import {
  SpacedRepetitionResultStyles,
  darkStyles,
  lightStyles,
} from './SpacedRepetitionResult.style';

export interface SpacedRepetitionResultProps {
  theme: Theme;
  feedbackListState: ObservableFeedbackListState;
  saveState: IObservableValue<ActivityState>;
  shouldShowAdOrGoogleConsentForm: IObservableValue<boolean>;
  showReviewFeedback: () => void;
  takeAnotherLesson: () => void;
  quit: () => void;
  styles?: {
    light: SpacedRepetitionResultStyles;
    dark: SpacedRepetitionResultStyles;
  };
}

@observer
export class SpacedRepetitionResult extends React.Component<
  SpacedRepetitionResultProps
> {
  public get styles(): SpacedRepetitionResultStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView style={this.styles.container}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>Result</DefaultText>
        </View>
        <ReviewFeedbackSummary
          theme={this.props.theme}
          feedbackListState={this.props.feedbackListState}
        />
        {this.renderSaveText()}
        {this.props.shouldShowAdOrGoogleConsentForm.get() ? (
          <View style={this.styles.ad_notice_container}>
            <AdNotice />
          </View>
        ) : null}
        {this.renderButtons()}
      </ScrollView>
    );
  }

  private renderSaveText(): null | React.ReactElement<any> {
    if (this.props.saveState.get() === ActivityState.ERROR) {
      return (
        <DefaultText style={this.styles.save_text}>
          Ops. Error occurred while saving.
        </DefaultText>
      );
    } else if (this.props.saveState.get() === ActivityState.ACTIVE) {
      return <DefaultText style={this.styles.save_text}>Saving...</DefaultText>;
    } else if (this.props.saveState.get() === ActivityState.INACTIVE) {
      return (
        <View style={this.styles.view_all_feedback_button_container}>
          <DefaultButton
            testID={SpacedRepetitionLessonScreenIds.VIEW_ALL_FEEDBACK_BTN}
            text="View all feedback"
            styles={FullRoundedButtonStyle.getFullGreyBackgroundStyles(
              ButtonSize.NORMAL,
            )}
            onPress={this.props.showReviewFeedback}
          />
        </View>
      );
    } else {
      return null;
    }
  }

  private renderButtons(): null | React.ReactElement<any> {
    // Only show buttons when save completed
    if (this.props.saveState.get() === ActivityState.INACTIVE) {
      return (
        <View style={this.styles.button_container}>
          <DefaultButton
            testID={SpacedRepetitionLessonScreenIds.TAKE_ANOTHER_LESSON_BTN}
            text="Take another lesson"
            styles={LessonScreenStyle.getLargeButtonStyles(
              config.styles.primaryColor,
              'white',
            )}
            onPress={this.props.takeAnotherLesson}
          />
          <DefaultButton
            testID={SpacedRepetitionLessonScreenIds.QUIT_BTN}
            text="Quit"
            styles={LessonScreenStyle.getLargeButtonStyles('#ddd', '#333')}
            onPress={this.props.quit}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}
