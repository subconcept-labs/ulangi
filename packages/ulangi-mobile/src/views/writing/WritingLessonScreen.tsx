/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableThemeStore,
  ObservableWritingLessonScreen,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

import { WritingLessonScreenIds } from '../../constants/ids/WritingLessonScreenIds';
import { WritingLessonScreenDelegate } from '../../delegates/writing/WritingLessonScreenDelegate';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { SmartScrollView } from '../common/SmartScrollView';
import { WritingForm } from './WritingForm';
import { WritingFormBottom } from './WritingFormBottom';
import { WritingFormTop } from './WritingFormTop';
import { WritingLessonResult } from './WritingLessonResult';
import {
  WritingLessonScreenStyles,
  darkStyles,
  lightStyles,
} from './WritingLessonScreen.style';

export interface WritingLessonScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableWritingLessonScreen;
  screenDelegate: WritingLessonScreenDelegate;
}

@observer
export class WritingLessonScreen extends React.Component<
  WritingLessonScreenProps
> {
  public get styles(): WritingLessonScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView
        testID={WritingLessonScreenIds.SCREEN}
        style={this.styles.screen}>
        {this.renderContent()}
      </SafeAreaView>
    );
  }

  private renderContent(): React.ReactElement<any> {
    if (this.props.observableScreen.shouldShowResult.get() === true) {
      return (
        <ScrollView keyboardShouldPersistTaps="handled">
          <WritingLessonResult
            theme={this.props.themeStore.theme}
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
        <>
          <SmartScrollView
            keyboardAware={true}
            keyboardShouldPersistTaps="handled">
            <DismissKeyboardView style={this.styles.dismiss_keyboard_view}>
              <WritingFormTop
                theme={this.props.themeStore.theme}
                writingFormState={this.props.observableScreen.writingFormState}
                showLastWritten={true}
              />
              <WritingForm
                key={
                  this.props.observableScreen.writingFormState.currentQuestion
                    .questionId
                }
                theme={this.props.themeStore.theme}
                writingFormState={this.props.observableScreen.writingFormState}
                setAnswer={this.props.screenDelegate.setAnswer}
                showHint={this.props.screenDelegate.showHint}
                next={_.noop}
              />
            </DismissKeyboardView>
          </SmartScrollView>
          <WritingFormBottom
            theme={this.props.themeStore.theme}
            writingFormState={this.props.observableScreen.writingFormState}
            reviewActionBarState={
              this.props.observableScreen.reviewActionBarState
            }
            reviewFeedbackBarState={
              this.props.observableScreen.reviewFeedbackBarState
            }
            next={this.props.screenDelegate.nextQuestion}
            showAnswer={this.props.screenDelegate.showAnswer}
            setFeedback={this.props.screenDelegate.setFeedback}
          />
        </>
      );
    }
  }
}
