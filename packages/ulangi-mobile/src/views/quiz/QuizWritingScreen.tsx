/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableQuizWritingScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { QuizWritingScreenIds } from '../../constants/ids/QuizWritingScreenIds';
import { QuizWritingScreenDelegate } from '../../delegates/quiz/QuizWritingScreenDelegate';
import { Screen } from '../common/Screen';
import { SmartScrollView } from '../common/SmartScrollView';
import { WritingForm } from '../writing/WritingForm';
import { WritingFormTop } from '../writing/WritingFormTop';
import { QuizWritingResult } from './QuizWritingResult';
import {
  QuizWritingScreenStyles,
  quizWritingScreenResponsiveStyles,
} from './QuizWritingScreen.style';

export interface QuizWritingScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableQuizWritingScreen;
  screenDelegate: QuizWritingScreenDelegate;
}

@observer
export class QuizWritingScreen extends React.Component<QuizWritingScreenProps> {
  public get styles(): QuizWritingScreenStyles {
    return quizWritingScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        testID={QuizWritingScreenIds.SCREEN}
        style={this.styles.screen}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <SmartScrollView
          keyboardAware={true}
          keyboardShouldPersistTaps="handled">
          {this.props.observableScreen.shouldShowResult.get() === true ? (
            <QuizWritingResult
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              writingResult={this.props.observableScreen.writingResult}
              takeAnotherQuiz={this.props.screenDelegate.takeAnotherQuiz}
              quit={this.props.screenDelegate.quit}
            />
          ) : (
            <React.Fragment>
              <WritingFormTop
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                writingFormState={this.props.observableScreen.writingFormState}
                showLastWritten={false}
                skip={this.props.screenDelegate.skip}
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
                next={this.props.screenDelegate.nextQuestion}
              />
            </React.Fragment>
          )}
        </SmartScrollView>
      </Screen>
    );
  }
}
