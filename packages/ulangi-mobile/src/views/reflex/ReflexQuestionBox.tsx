/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  ObservableCommandList,
  ObservableReflexGameState,
} from '@ulangi/ulangi-observable';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface ReflexQuestionBoxProps {
  gameState: ObservableReflexGameState;
}

export interface ReflexQuestionBoxState {
  scaleX: Animated.Value;
}

@observer
export class ReflexQuestionBox extends React.Component<
  ReflexQuestionBoxProps,
  ReflexQuestionBoxState
> {
  private unsubscribeHandleCommand!: () => void;
  private unsubscribeScaling?: string;
  private timerRef: any;

  public constructor(props: ReflexQuestionBoxProps) {
    super(props);

    this.state = {
      scaleX: new Animated.Value(1),
    };
  }

  private handleCommand(commandList: ObservableCommandList): void {
    while (commandList.commands.length > 0) {
      const command = assertExists(commandList.commands.shift());
      switch (command.kind) {
        case 'scaleX':
          Animated.timing(this.state.scaleX, {
            toValue: command.scaleX,
            duration: command.duration,
            useNativeDriver: true,
          }).start(
            (result): void => {
              if (result.finished === true) {
                command.state = 'completed';
              }
            },
          );
          break;

        case 'stop':
          this.state.scaleX.stopAnimation(
            (): void => {
              command.state = 'completed';
            },
          );
          break;

        case 'stopAndReset':
          this.state.scaleX.stopAnimation(
            (): void => {
              command.state = 'completed';
              this.state.scaleX.setValue(1);
            },
          );
          break;
      }
    }
  }

  private scaling(value: number): void {
    this.timerRef.setNativeProps({
      width: value * 100 + '%',
    });
  }

  public componentDidMount(): void {
    this.unsubscribeScaling = this.state.scaleX.addListener(
      ({ value }): void => {
        this.scaling(value);
        this.props.gameState.remainingTime =
          value * config.reflex.timePerQuestion;
      },
    );
    this.unsubscribeHandleCommand = autorun(
      (): void => this.handleCommand(this.props.gameState.timerCommandList),
    );
  }

  public componentWillUnmount(): void {
    this.unsubscribeHandleCommand();
    if (typeof this.unsubscribeScaling !== 'undefined') {
      this.state.scaleX.removeListener(this.unsubscribeScaling);
    }
    this.state.scaleX.stopAnimation(
      (): void => {
        this.state.scaleX.removeAllListeners();
      },
    );
  }

  private renderQuestion(): React.ReactElement<any> {
    const currentQuestion = assertExists(
      this.props.gameState.currentQuestion,
      'currentQuestion should not be null or undefined',
    );
    return (
      <DefaultText style={styles.question}>
        <DefaultText style={styles.vocabulary}>
          {currentQuestion.vocabularyTerm + ': '}
        </DefaultText>
        <DefaultText style={styles.meaning}>
          {currentQuestion.randomMeaning}
        </DefaultText>
      </DefaultText>
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <View style={styles.question_container}>
          {this.props.gameState.started === false ? (
            <DefaultText style={styles.question}>
              Rule: If the answer is correct, press{' '}
              <DefaultText style={styles.yes}>YES</DefaultText>. Otherwise,
              press <DefaultText style={styles.no}>NO</DefaultText>.
            </DefaultText>
          ) : (
            this.renderQuestion()
          )}
        </View>
        <View style={styles.time_bar_container}>
          <View style={styles.time_bar_placeholder}>
            <View
              ref={(ref: any): void => {
                this.timerRef = ref;
              }}
              style={styles.time_bar}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },

  question_container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  question: {
    textAlign: 'center',
    color: '#555',
    fontSize: 17,
    lineHeight: 22,
  },

  time_bar_container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#e6e6e6',
  },

  time_bar_placeholder: {
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },

  time_bar: {
    height: 8,
    backgroundColor: 'darkturquoise',
  },

  yes: {
    color: '#2fc68f',
    fontWeight: 'bold',
  },

  no: {
    color: '#ff7396',
    fontWeight: 'bold',
  },

  vocabulary: {
    fontWeight: 'bold',
    color: config.reflex.backgroundColor,
  },

  meaning: {
    color: '#555',
  },
});
