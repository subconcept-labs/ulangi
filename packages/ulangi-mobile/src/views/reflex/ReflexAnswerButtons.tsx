/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ObservableReflexGameState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ReflexScreenIds } from '../../constants/ids/ReflexScreenIds';
import { ls, ss } from '../../utils/responsive';
import { DefaultText } from '../common/DefaultText';

export interface ReflexAnswerButtonsProps {
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

  public render(): React.ReactElement<any> {
    if (this.props.gameState.started === false) {
      return (
        <View style={styles.vertical_axis_container}>
          <TouchableOpacity
            testID={ReflexScreenIds.START_BTN}
            style={styles.start_button}
            onPress={this.props.startGame}>
            <DefaultText style={styles.start_text}>START</DefaultText>
          </TouchableOpacity>
          <View style={styles.note_container}>
            <DefaultText style={styles.note}>
              Note: This game is more fun when you have a lot of vocabulary
              terms to practice.
            </DefaultText>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.horizontal_axis_container}>
          <TouchableOpacity
            testID={
              this.isAnswerCorrect('NO')
                ? ReflexScreenIds.CORRECT_BTN
                : ReflexScreenIds.INCORRECT_BTN
            }
            style={styles.touchable}
            onPress={(): void => this.props.onAnswerPressed('NO')}>
            <DefaultText
              style={[styles.touchable_text, styles.touchable_text_red]}>
              NO
            </DefaultText>
          </TouchableOpacity>
          <TouchableOpacity
            testID={
              this.isAnswerCorrect('YES')
                ? ReflexScreenIds.CORRECT_BTN
                : ReflexScreenIds.INCORRECT_BTN
            }
            style={styles.touchable}
            onPress={(): void => this.props.onAnswerPressed('YES')}>
            <DefaultText
              style={[styles.touchable_text, styles.touchable_text_green]}>
              YES
            </DefaultText>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  vertical_axis_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: ls(16),
  },

  horizontal_axis_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: ls(8),
  },

  start_button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ss(16),
    alignSelf: 'stretch',
    backgroundColor: 'mintcream',
    borderRadius: ss(8),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    elevation: 2,
  },

  start_text: {
    fontFamily: 'Raleway-Black',
    color: '#2fc68f',
    paddingVertical: ss(16),
    fontSize: ss(35),
  },

  touchable: {
    marginHorizontal: ls(8),
    marginVertical: ss(30),
    justifyContent: 'center',
    alignItems: 'center',
    height: ss(120),
    flex: 1,
    backgroundColor: 'mintcream',
    borderRadius: ss(8),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    elevation: 2,
  },

  touchable_text: {
    fontFamily: 'Raleway-Black',
    fontSize: ss(35),
  },

  touchable_text_green: {
    color: '#2fc68f',
  },

  touchable_text_red: {
    color: '#ff7396',
  },

  note_container: {
    marginBottom: ss(16),
  },

  note: {
    fontSize: ss(14),
    lineHeight: ss(19),
    textAlign: 'center',
    color: '#21eddc',
  },
});
