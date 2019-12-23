/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableWritingResult } from '@ulangi/ulangi-observable';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { QuizWritingScreenIds } from '../../constants/ids/QuizWritingScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { WritingSummary } from '../writing/WritingSummary';
import {
  QuizWritingResultStyles,
  darkStyles,
  lightStyles,
} from './QuizWritingResult.style';

export interface QuizWritingResultProps {
  theme: Theme;
  writingResult: ObservableWritingResult;
  takeAnotherQuiz: () => void;
  quit: () => void;
  styles?: {
    light: QuizWritingResultStyles;
    dark: QuizWritingResultStyles;
  };
}

export class QuizWritingResult extends React.Component<QuizWritingResultProps> {
  public get styles(): QuizWritingResultStyles {
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
        <WritingSummary
          theme={this.props.theme}
          writingResult={this.props.writingResult}
        />
        <View style={this.styles.button_container}>
          <DefaultButton
            testID={QuizWritingScreenIds.TAKE_ANOTHER_QUIZ_BTN}
            text="Take another quiz"
            styles={LessonScreenStyle.getLargeButtonStyles(
              config.styles.primaryColor,
              'white',
            )}
            onPress={this.props.takeAnotherQuiz}
          />
          <DefaultButton
            testID={QuizWritingScreenIds.QUIT_BTN}
            text="Quit"
            styles={LessonScreenStyle.getLargeButtonStyles('#ddd', '#333')}
            onPress={this.props.quit}
          />
        </View>
      </View>
    );
  }
}
