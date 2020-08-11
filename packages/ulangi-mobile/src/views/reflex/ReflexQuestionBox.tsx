/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableCommandList,
  ObservableReflexGameState,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Animated, View } from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';
import {
  ReflexQuestionBoxStyles,
  reflexQuestionBoxResponsiveStyles,
} from './ReflexQuestionBox.style';

export interface ReflexQuestionBoxProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
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

  private get styles(): ReflexQuestionBoxStyles {
    return reflexQuestionBoxResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  private renderQuestion(): React.ReactElement<any> {
    const currentQuestion = assertExists(
      this.props.gameState.currentQuestion,
      'currentQuestion should not be null or undefined',
    );
    return (
      <DefaultText style={this.styles.question}>
        <DefaultText style={this.styles.vocabulary}>
          {currentQuestion.vocabularyTerm + ': '}
        </DefaultText>
        <DefaultText style={this.styles.meaning}>
          {currentQuestion.randomMeaning}
        </DefaultText>
      </DefaultText>
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.question_container}>
          {this.props.gameState.started === false ? (
            <DefaultText style={this.styles.question}>
              Try your best to answer{' '}
              <DefaultText style={this.styles.yes}>YES</DefaultText> or{' '}
              <DefaultText style={this.styles.no}>NO</DefaultText> quickly.
            </DefaultText>
          ) : (
            this.renderQuestion()
          )}
        </View>
        <View style={this.styles.time_bar_container}>
          <View style={this.styles.time_bar_placeholder}>
            <View
              ref={(ref: any): void => {
                this.timerRef = ref;
              }}
              style={this.styles.time_bar}
            />
          </View>
        </View>
      </View>
    );
  }
}
