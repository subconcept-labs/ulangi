/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableThemeStore,
  ObservableWritingLessonScreen,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { WritingLessonScreenIds } from '../../constants/ids/WritingLessonScreenIds';
import { WritingLessonScreenDelegate } from '../../delegates/writing/WritingLessonScreenDelegate';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { Screen } from '../common/Screen';
import { SmartScrollView } from '../common/SmartScrollView';
import { WritingForm } from './WritingForm';
import { WritingFormBottom } from './WritingFormBottom';
import { WritingFormTop } from './WritingFormTop';
import { WritingLessonResult } from './WritingLessonResult';
import {
  WritingLessonScreenStyles,
  writingLessonScreenResponsiveStyles,
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
  private get styles(): WritingLessonScreenStyles {
    return writingLessonScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        testID={WritingLessonScreenIds.SCREEN}
        style={this.styles.screen}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        {this.renderContent()}
      </Screen>
    );
  }

  private renderContent(): React.ReactElement<any> {
    if (this.props.observableScreen.shouldShowResult.get() === true) {
      return (
        <ScrollView keyboardShouldPersistTaps="handled">
          <WritingLessonResult
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            feedbackListState={this.props.observableScreen.feedbackListState}
            saveState={this.props.observableScreen.saveState}
            showReviewFeedback={this.props.screenDelegate.showReviewFeedback}
            shouldShowAdOrGoogleConsentForm={
              this.props.observableScreen.shouldShowAdOrGoogleConsentForm
            }
            takeAnotherLesson={this.props.screenDelegate.takeAnotherLesson}
            quit={this.props.screenDelegate.showAdIfRequiredThenQuit}
            upgradeToPremium={this.props.screenDelegate.goToAccountTypeScreen}
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
                screenLayout={this.props.observableScreen.screenLayout}
                writingFormState={this.props.observableScreen.writingFormState}
                showLastWritten={true}
              />
              <WritingForm
                key={
                  this.props.observableScreen.writingFormState.currentQuestion
                    .questionId
                }
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                writingFormState={this.props.observableScreen.writingFormState}
                setAnswer={this.props.screenDelegate.setAnswer}
                showHint={this.props.screenDelegate.showHint}
                next={_.noop}
              />
            </DismissKeyboardView>
          </SmartScrollView>
          <WritingFormBottom
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
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
