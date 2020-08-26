/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ActivityState,
  ButtonSize,
  ReviewPriority,
  Theme,
} from '@ulangi/ulangi-common/enums';
import {
  ObservableFeedbackListState,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { config } from '../../constants/config';
import { WritingLessonScreenIds } from '../../constants/ids/WritingLessonScreenIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { roundedCornerButtonStyles } from '../../styles/RoundedCornerButtonStyles';
import { AdNotice } from '../ad/AdNotice';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { ReviewFeedbackSummary } from '../review-feedback/ReviewFeedbackSummary';
import { DueAndNewCounts } from '../spaced-repetition/DueAndNewCounts';
import {
  WritingLessonResultStyles,
  writingLessonResultResponsiveStyles,
} from './WritingLessonResult.style';

export interface WritingLessonResultProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  feedbackListState: ObservableFeedbackListState;
  saveState: IObservableValue<ActivityState>;
  counts: undefined | { due: number; new: number };
  shouldShowAdOrGoogleConsentForm: IObservableValue<boolean>;
  showReviewFeedback: () => void;
  takeAnotherLesson: (
    overrideReviewPriority: undefined | ReviewPriority,
  ) => void;
  quit: () => void;
  upgradeToPremium: () => void;
}

@observer
export class WritingLessonResult extends React.Component<
  WritingLessonResultProps
> {
  private get styles(): WritingLessonResultStyles {
    return writingLessonResultResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView style={this.styles.container}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>Result</DefaultText>
        </View>
        <ReviewFeedbackSummary
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          feedbackListState={this.props.feedbackListState}
        />
        {this.renderSaveText()}
        {this.props.shouldShowAdOrGoogleConsentForm.get() ? (
          <View style={this.styles.ad_notice_container}>
            <AdNotice
              theme={this.props.theme}
              screenLayout={this.props.screenLayout}
              upgradeToPremium={this.props.upgradeToPremium}
            />
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
            testID={WritingLessonScreenIds.VIEW_ALL_FEEDBACK_BTN}
            text="View detailed result"
            styles={fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
              ButtonSize.NORMAL,
              this.props.theme,
              this.props.screenLayout,
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
        <View style={this.styles.button_containers}>
          <View style={this.styles.counts_container}>
            <DueAndNewCounts
              theme={this.props.theme}
              screenLayout={this.props.screenLayout}
              counts={this.props.counts}
              reviewDueFirst={(): void =>
                this.props.takeAnotherLesson(ReviewPriority.DUE_TERMS_FIRST)
              }
              reviewNewFirst={(): void =>
                this.props.takeAnotherLesson(ReviewPriority.NEW_TERMS_FIRST)
              }
              showLeft={true}
            />
          </View>
          <View style={this.styles.button_container}>
            <DefaultButton
              testID={WritingLessonScreenIds.TAKE_ANOTHER_LESSON_BTN}
              text="Continue"
              styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
                ButtonSize.LARGE,
                3,
                config.styles.primaryColor,
                'white',
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={(): void => this.props.takeAnotherLesson(undefined)}
            />
          </View>
          <View style={this.styles.button_container}>
            <DefaultButton
              testID={WritingLessonScreenIds.QUIT_BTN}
              text="Quit"
              styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
                ButtonSize.LARGE,
                3,
                '#ddd',
                '#333',
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={this.props.quit}
            />
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}
