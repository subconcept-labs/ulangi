/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableWritingResult,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { QuizWritingScreenIds } from '../../constants/ids/QuizWritingScreenIds';
import { roundedCornerButtonStyles } from '../../styles/RoundedCornerButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { WritingSummary } from '../writing/WritingSummary';
import {
  QuizWritingResultStyles,
  quizWritingResultResponsiveStyles,
} from './QuizWritingResult.style';

export interface QuizWritingResultProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  writingResult: ObservableWritingResult;
  takeAnotherQuiz: () => void;
  quit: () => void;
}

export class QuizWritingResult extends React.Component<QuizWritingResultProps> {
  public get styles(): QuizWritingResultStyles {
    return quizWritingResultResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>Test Result</DefaultText>
        </View>
        <WritingSummary
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          writingResult={this.props.writingResult}
        />
        <View style={this.styles.button_containers}>
          <View style={this.styles.button_container}>
            <DefaultButton
              testID={QuizWritingScreenIds.TAKE_ANOTHER_QUIZ_BTN}
              text="Take another quiz"
              styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
                ButtonSize.LARGE,
                3,
                config.styles.primaryColor,
                'white',
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={this.props.takeAnotherQuiz}
            />
          </View>
          <View style={this.styles.button_container}>
            <DefaultButton
              testID={QuizWritingScreenIds.QUIT_BTN}
              text="Quit"
              styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
                ButtonSize.LARGE,
                3,
                '#ddd',
                '#333',
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={this.props.quit}
            />
          </View>
        </View>
      </View>
    );
  }
}
