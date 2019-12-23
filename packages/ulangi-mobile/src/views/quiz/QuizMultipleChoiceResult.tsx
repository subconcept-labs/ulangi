/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableQuizMultipleChoiceScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { QuizMultipleChoiceScreenIds } from '../../constants/ids/QuizMultipleChoiceScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { MultipleChoiceSummary } from '../multiple-choice/MultipleChoiceSummary';
import {
  QuizMultipleChoiceResultStyles,
  darkStyles,
  lightStyles,
} from './QuizMultipleChoiceResult.style';

export interface QuizMultipleChoiceResultProps {
  theme: Theme;
  observableScreen: ObservableQuizMultipleChoiceScreen;
  takeAnotherQuiz: () => void;
  quit: () => void;
  styles?: {
    light: QuizMultipleChoiceResultStyles;
    dark: QuizMultipleChoiceResultStyles;
  };
}

@observer
export class QuizMultipleChoiceResult extends React.Component<
  QuizMultipleChoiceResultProps
> {
  public get styles(): QuizMultipleChoiceResultStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>Test Result</DefaultText>
        </View>
        <MultipleChoiceSummary
          theme={this.props.theme}
          multipleChoiceResult={
            this.props.observableScreen.multipleChoiceResult
          }
        />
        <View style={this.styles.button_container}>
          <DefaultButton
            testID={QuizMultipleChoiceScreenIds.TAKE_ANOTHER_QUIZ_BTN}
            text="Take another quiz"
            styles={LessonScreenStyle.getLargeButtonStyles(
              config.styles.primaryColor,
              'white',
            )}
            onPress={this.props.takeAnotherQuiz}
          />
          <DefaultButton
            testID={QuizMultipleChoiceScreenIds.QUIT_BTN}
            text="Quit"
            styles={LessonScreenStyle.getLargeButtonStyles('#ddd', '#333')}
            onPress={this.props.quit}
          />
        </View>
      </View>
    );
  }
}
