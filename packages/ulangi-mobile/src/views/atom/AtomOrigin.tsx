/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  ObservableAtomGameStats,
  ObservableCommandList,
  ObservableOrigin,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface AtomOriginProps {
  origin: ObservableOrigin;
  gameStats: ObservableAtomGameStats;
}

export interface AtomOriginState {
  scale: Animated.Value;
}

@observer
export class AtomOrigin extends React.Component<
  AtomOriginProps,
  AtomOriginState
> {
  private unsubscribeHandleCommand: () => void;

  public constructor(props: AtomOriginProps) {
    super(props);

    this.state = {
      scale: new Animated.Value(1),
    };

    this.unsubscribeHandleCommand = (): void => {
      _.noop;
    };
  }

  private getContainerStyle(): ViewStyle {
    return {
      height: config.atom.originSize,
      width: config.atom.originSize,
      borderRadius: config.atom.originSize / 2,
      left: this.props.origin.position.x - config.atom.originSize / 2,
      top: this.props.origin.position.y - config.atom.originSize / 2,
    };
  }

  private handleCommand(commandList: ObservableCommandList): void {
    while (commandList.commands.length > 0) {
      const command = assertExists(commandList.commands.shift());
      switch (command.kind) {
        case 'elasticScale':
          Animated.sequence([
            Animated.timing(this.state.scale, {
              toValue: command.scaleTo.scaleX,
              useNativeDriver: true,
            }),
            Animated.spring(this.state.scale, {
              toValue: command.scaleBack.scaleX,
              friction: 10,
              tension: 40,
              useNativeDriver: true,
            }),
          ]).start(
            (): void => {
              command.state = 'completed';
            },
          );
          break;
      }
    }
  }

  private getTransformStyle(): {
    transform: { [key: string]: Animated.Value }[];
  } {
    return {
      transform: [{ scaleX: this.state.scale }, { scaleY: this.state.scale }],
    };
  }

  public componentDidMount(): void {
    this.unsubscribeHandleCommand = autorun(
      (): void => this.handleCommand(this.props.origin.commandList),
    );
  }

  public componentWillUnmount(): void {
    this.unsubscribeHandleCommand();
  }

  public render(): React.ReactElement<any> {
    return (
      <Animated.View
        style={[
          styles.container,
          this.getContainerStyle(),
          this.getTransformStyle(),
        ]}>
        <DefaultText style={styles.move_count}>
          {this.props.gameStats.remainingMoves}
        </DefaultText>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: config.atom.secondaryColor,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.8,
    shadowOpacity: 0.2,
  },

  move_count: {
    color: '#fff',
    fontFamily: 'JosefinSans-Bold',
    fontSize: 18,
    marginTop: 2,
  },
});
