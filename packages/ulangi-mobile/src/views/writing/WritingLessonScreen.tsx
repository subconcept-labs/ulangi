/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeStore,
  ObservableWritingLessonScreen,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

import { WritingLessonScreenIds } from '../../constants/ids/WritingLessonScreenIds';
import { WritingLessonScreenDelegate } from '../../delegates/writing/WritingLessonScreenDelegate';
import { SmartScrollView } from '../common/SmartScrollView';
import { ReviewFeedbackBar } from '../review-feedback/ReviewFeedbackBar';
import { WritingForm } from './WritingForm';
import { WritingFormTop } from './WritingFormTop';
import { WritingLessonResult } from './WritingLessonResult';
import {
  WritingLessonScreenStyles,
  darkStyles,
  lightStyles,
} from './WritingLessonScreen.style';

export interface WritingLessonScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableWritingLessonScreen;
  screenDelegate: WritingLessonScreenDelegate;
}

@observer
export class WritingLessonScreen extends React.Component<
  WritingLessonScreenProps
> {
  public get styles(): WritingLessonScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView
        testID={WritingLessonScreenIds.SCREEN}
        style={this.styles.screen}
      >
        {this.renderContent()}
      </SafeAreaView>
    );
  }

  private renderContent(): React.ReactElement<any> {
    if (this.props.observableScreen.shouldShowResult.get() === true) {
      return (
        <ScrollView keyboardShouldPersistTaps="handled">
          <WritingLessonResult
            theme={this.props.darkModeStore.theme}
            feedbackListState={this.props.observableScreen.feedbackListState}
            saveState={this.props.observableScreen.saveState}
            showReviewFeedback={this.props.screenDelegate.showReviewFeedback}
            shouldShowAdOrGoogleConsentForm={
              this.props.observableScreen.shouldShowAdOrGoogleConsentForm
            }
            takeAnotherLesson={this.props.screenDelegate.takeAnotherLesson}
            quit={this.props.screenDelegate.quit}
          />
        </ScrollView>
      );
    } else {
      return (
        <React.Fragment>
          <SmartScrollView
            keyboardAware={true}
            keyboardShouldPersistTaps="handled"
          >
            <WritingFormTop
              theme={this.props.darkModeStore.theme}
              writingFormState={this.props.observableScreen.writingFormState}
              showLastWritten={true}
            />
            <WritingForm
              key={
                this.props.observableScreen.writingFormState.currentQuestion
                  .questionId
              }
              theme={this.props.darkModeStore.theme}
              writingFormState={this.props.observableScreen.writingFormState}
              setAnswer={this.props.screenDelegate.setAnswer}
              showHint={this.props.screenDelegate.showHint}
              next={_.noop}
              disable={this.props.screenDelegate.disable}
            />
          </SmartScrollView>
          <ReviewFeedbackBar
            theme={this.props.darkModeStore.theme}
            reviewFeedbackBarState={
              this.props.observableScreen.reviewFeedbackBarState
            }
            setFeedback={this.props.screenDelegate.setFeedback}
          />
        </React.Fragment>
      );
    }
  }
}
