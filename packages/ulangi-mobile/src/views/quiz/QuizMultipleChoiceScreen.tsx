/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableQuizMultipleChoiceScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { QuizMultipleChoiceScreenIds } from '../../constants/ids/QuizMultipleChoiceScreenIds';
import { QuizMultipleChoiceScreenDelegate } from '../../delegates/quiz/QuizMultipleChoiceScreenDelegate';
import { Screen } from '../common/Screen';
import { MultipleChoiceForm } from '../multiple-choice/MultipleChoiceForm';
import { MultipleChoiceFormTop } from '../multiple-choice/MultipleChoiceFormTop';
import { QuizMultipleChoiceResult } from './QuizMultipleChoiceResult';
import {
  QuizMultipleChoiceScreenStyles,
  quizMultipleChoiceScreenResponsiveStyles,
} from './QuizMultipleChoiceScreen.style';

export interface QuizMultipleChoiceScreenProps {
  themeStore: ObservableThemeStore;
  screenDelegate: QuizMultipleChoiceScreenDelegate;
  observableScreen: ObservableQuizMultipleChoiceScreen;
}

@observer
export class QuizMultipleChoiceScreen extends React.Component<
  QuizMultipleChoiceScreenProps
> {
  public get styles(): QuizMultipleChoiceScreenStyles {
    return quizMultipleChoiceScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        testID={QuizMultipleChoiceScreenIds.SCREEN}
        style={this.styles.screen}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <ScrollView>
          {this.props.observableScreen.shouldShowResult.get() === true ? (
            <QuizMultipleChoiceResult
              theme={this.props.themeStore.theme}
              observableScreen={this.props.observableScreen}
              takeAnotherQuiz={this.props.screenDelegate.takeAnotherQuiz}
              quit={this.props.screenDelegate.quit}
            />
          ) : (
            <React.Fragment>
              <MultipleChoiceFormTop
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                multipleChoiceFormState={
                  this.props.observableScreen.multipleChoiceFormState
                }
              />
              <MultipleChoiceForm
                key={
                  this.props.observableScreen.multipleChoiceFormState
                    .currentQuestion.questionId
                }
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                multipleChoiceFormState={
                  this.props.observableScreen.multipleChoiceFormState
                }
                selectAnswer={this.props.screenDelegate.handleSelectAnswer}
              />
            </React.Fragment>
          )}
        </ScrollView>
      </Screen>
    );
  }
}
