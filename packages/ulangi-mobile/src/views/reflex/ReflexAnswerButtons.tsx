/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableReflexGameState,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ReflexScreenIds } from '../../constants/ids/ReflexScreenIds';
import { DefaultText } from '../common/DefaultText';
import {
  ReflexAnswerButtonStyles,
  reflexAnswerButtonResponsiveStyles,
} from './ReflexAnswerButton.style';

export interface ReflexAnswerButtonsProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  gameState: ObservableReflexGameState;
  startGame: () => void;
  onAnswerPressed: (answer: 'YES' | 'NO') => void;
}

@observer
export class ReflexAnswerButtons extends React.Component<
  ReflexAnswerButtonsProps
> {
  private isAnswerCorrect(answer: 'YES' | 'NO'): boolean {
    const currentQuestion = assertExists(
      this.props.gameState.currentQuestion,
      'currentQuestion should not be null or undefined',
    );
    if (answer === 'YES') {
      return currentQuestion.correctMeaning === currentQuestion.randomMeaning;
    } else {
      return currentQuestion.correctMeaning !== currentQuestion.randomMeaning;
    }
  }

  private get styles(): ReflexAnswerButtonStyles {
    return reflexAnswerButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    if (this.props.gameState.started === false) {
      return (
        <View style={this.styles.vertical_axis_container}>
          <TouchableOpacity
            testID={ReflexScreenIds.START_BTN}
            style={this.styles.start_button}
            onPress={this.props.startGame}>
            <DefaultText style={this.styles.start_text}>START</DefaultText>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={this.styles.horizontal_axis_container}>
          <TouchableOpacity
            testID={
              this.isAnswerCorrect('NO')
                ? ReflexScreenIds.CORRECT_BTN
                : ReflexScreenIds.INCORRECT_BTN
            }
            style={this.styles.touchable}
            onPress={(): void => this.props.onAnswerPressed('NO')}>
            <DefaultText
              style={[
                this.styles.touchable_text,
                this.styles.touchable_text_red,
              ]}>
              NO
            </DefaultText>
          </TouchableOpacity>
          <TouchableOpacity
            testID={
              this.isAnswerCorrect('YES')
                ? ReflexScreenIds.CORRECT_BTN
                : ReflexScreenIds.INCORRECT_BTN
            }
            style={this.styles.touchable}
            onPress={(): void => this.props.onAnswerPressed('YES')}>
            <DefaultText
              style={[
                this.styles.touchable_text,
                this.styles.touchable_text_green,
              ]}>
              YES
            </DefaultText>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
