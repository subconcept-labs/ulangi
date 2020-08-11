/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableQuizMultipleChoiceScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { QuizMultipleChoiceScreenIds } from '../../constants/ids/QuizMultipleChoiceScreenIds';
import { roundedCornerButtonStyles } from '../../styles/RoundedCornerButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { MultipleChoiceSummary } from '../multiple-choice/MultipleChoiceSummary';
import {
  QuizMultipleChoiceResultStyles,
  quizMultipleChoiceResultResponsiveStyles,
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
    return quizMultipleChoiceResultResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>Test Result</DefaultText>
        </View>
        <MultipleChoiceSummary
          theme={this.props.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          multipleChoiceResult={
            this.props.observableScreen.multipleChoiceResult
          }
        />
        <View style={this.styles.button_containers}>
          <View style={this.styles.button_container}>
            <DefaultButton
              testID={QuizMultipleChoiceScreenIds.TAKE_ANOTHER_QUIZ_BTN}
              text="Take another quiz"
              styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
                ButtonSize.LARGE,
                3,
                config.styles.primaryColor,
                'white',
                this.props.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={this.props.takeAnotherQuiz}
            />
          </View>
          <View style={this.styles.button_container}>
            <DefaultButton
              testID={QuizMultipleChoiceScreenIds.QUIT_BTN}
              text="Quit"
              styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
                ButtonSize.LARGE,
                3,
                '#ddd',
                '#333',
                this.props.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={this.props.quit}
            />
          </View>
        </View>
      </View>
    );
  }
}
