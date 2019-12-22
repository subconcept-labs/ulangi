/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeStore,
  ObservableQuizMultipleChoiceScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { QuizMultipleChoiceScreenIds } from '../../constants/ids/QuizMultipleChoiceScreenIds';
import { QuizMultipleChoiceScreenDelegate } from '../../delegates/quiz/QuizMultipleChoiceScreenDelegate';
import { MultipleChoiceForm } from '../multiple-choice/MultipleChoiceForm';
import { MultipleChoiceFormTop } from '../multiple-choice/MultipleChoiceFormTop';
import { QuizMultipleChoiceResult } from './QuizMultipleChoiceResult';
import {
  QuizMultipleChoiceScreenStyles,
  darkStyles,
  lightStyles,
} from './QuizMultipleChoiceScreen.style';

export interface QuizMultipleChoiceScreenProps {
  darkModeStore: ObservableDarkModeStore;
  screenDelegate: QuizMultipleChoiceScreenDelegate;
  observableScreen: ObservableQuizMultipleChoiceScreen;
}

@observer
export class QuizMultipleChoiceScreen extends React.Component<
  QuizMultipleChoiceScreenProps
> {
  public get styles(): QuizMultipleChoiceScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View
        testID={QuizMultipleChoiceScreenIds.SCREEN}
        style={this.styles.screen}
      >
        <ScrollView>
          {this.props.observableScreen.shouldShowResult.get() === true ? (
            <QuizMultipleChoiceResult
              theme={this.props.darkModeStore.theme}
              observableScreen={this.props.observableScreen}
              takeAnotherQuiz={this.props.screenDelegate.takeAnotherQuiz}
              quit={this.props.screenDelegate.quit}
            />
          ) : (
            <React.Fragment>
              <MultipleChoiceFormTop
                theme={this.props.darkModeStore.theme}
                multipleChoiceFormState={
                  this.props.observableScreen.multipleChoiceFormState
                }
              />
              <MultipleChoiceForm
                key={
                  this.props.observableScreen.multipleChoiceFormState
                    .currentQuestion.questionId
                }
                theme={this.props.darkModeStore.theme}
                multipleChoiceFormState={
                  this.props.observableScreen.multipleChoiceFormState
                }
                selectAnswer={this.props.screenDelegate.handleSelectAnswer}
              />
            </React.Fragment>
          )}
        </ScrollView>
      </View>
    );
  }
}
