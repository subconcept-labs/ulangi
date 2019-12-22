/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeStore,
  ObservableQuizWritingScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { QuizWritingScreenIds } from '../../constants/ids/QuizWritingScreenIds';
import { QuizWritingScreenDelegate } from '../../delegates/quiz/QuizWritingScreenDelegate';
import { SmartScrollView } from '../common/SmartScrollView';
import { WritingForm } from '../writing/WritingForm';
import { WritingFormTop } from '../writing/WritingFormTop';
import { QuizWritingResult } from './QuizWritingResult';
import {
  QuizWritingScreenStyles,
  darkStyles,
  lightStyles,
} from './QuizWritingScreen.style';

export interface QuizWritingScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableQuizWritingScreen;
  screenDelegate: QuizWritingScreenDelegate;
}

@observer
export class QuizWritingScreen extends React.Component<QuizWritingScreenProps> {
  public get styles(): QuizWritingScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View testID={QuizWritingScreenIds.SCREEN} style={this.styles.screen}>
        <SmartScrollView
          keyboardAware={true}
          keyboardShouldPersistTaps="handled"
        >
          {this.props.observableScreen.shouldShowResult.get() === true ? (
            <QuizWritingResult
              theme={this.props.darkModeStore.theme}
              writingResult={this.props.observableScreen.writingResult}
              takeAnotherQuiz={this.props.screenDelegate.takeAnotherQuiz}
              quit={this.props.screenDelegate.quit}
            />
          ) : (
            <React.Fragment>
              <WritingFormTop
                theme={this.props.darkModeStore.theme}
                writingFormState={this.props.observableScreen.writingFormState}
                showLastWritten={false}
                skip={this.props.screenDelegate.skip}
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
                next={this.props.screenDelegate.nextQuestion}
              />
            </React.Fragment>
          )}
        </SmartScrollView>
      </View>
    );
  }
}
