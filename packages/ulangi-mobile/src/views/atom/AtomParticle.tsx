/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { AtomShellType, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableCommandList,
  ObservableParticle,
  ObservableScreenLayout,
  ObservableShell,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  PanResponderInstance,
  ViewStyle,
} from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';
import {
  AtomParticleStyles,
  atomParticleResponsiveStyles,
} from './AtomParticle.style';

export interface AtomParticleProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  particle: ObservableParticle;
  getShellByPosition: (position: {
    x: number;
    y: number;
  }) => ObservableShell | undefined;
  transferParticleToSameShell: (
    particle: ObservableParticle,
    position: { x: number; y: number },
    isUserMove: boolean,
  ) => void;
  transferParticleToAnotherShell: (
    particle: ObservableParticle,
    position: { x: number; y: number },
    newShell: AtomShellType,
    isUserMove: boolean,
  ) => void;
  isMaxReached: (shell: AtomShellType) => boolean;
}

export interface AtomParticleState {
  pan: Animated.AnimatedValueXY;
}

@observer
export class AtomParticle extends React.Component<
  AtomParticleProps,
  AtomParticleState
> {
  private panResponder: PanResponderInstance;
  private unsubscribeHandleCommand: () => void;

  private get styles(): AtomParticleStyles {
    return atomParticleResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public constructor(props: AtomParticleProps) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY({
        x: this.props.particle.position.x,
        y: this.props.particle.position.y,
      }),
    };

    this.unsubscribeHandleCommand = (): void => {
      _.noop();
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (): boolean => true,
      onMoveShouldSetPanResponder: (): boolean => true,
      onPanResponderGrant: (): void => {
        //this.state.pan.extractOffset()
        //this.state.pan.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: (__, gestureState): void => {
        if (this.props.particle.enabled === true) {
          const x = gestureState.moveX - config.atom.particleSize / 2;
          const y = gestureState.moveY - config.atom.particleSize / 2;
          this.state.pan.setValue({ x, y });
          //this.onMoving({ x: this.currentPositionX, y: this.currentPositionY })
        }
      },
      onPanResponderRelease: (__, gestureState): void => {
        //this.state.pan.flattenOffset()
        const x = gestureState.moveX - config.atom.particleSize / 2;
        const y = gestureState.moveY - config.atom.particleSize / 2;
        this.onReleased({ x, y });
      },
    });
  }

  /*
  private onMoving(position: {x: number, y: number}){
    const shellParticleAt = this.props.getShellByPosition(position)
    if (typeof shellParticleAt !== "undefined"){
      // If currently hover is not the current shell and max is reacted then highlight red
      if (shellParticleAt.shellType !== this.props.particle.shellType && this.props.isMaxReached(shellParticleAt.shellType)){
        this.props.highlightShell(shellParticleAt.shellType, "red")
      }
      else {
        this.props.highlightShell(shellParticleAt.shellType, "green")
      }
    }
    else {
      this.props.unhighlightShell()
    }
  }
  */

  private onReleased(position: { x: number; y: number }): void {
    const newShell = this.props.getShellByPosition(position);
    if (typeof newShell === 'undefined') {
      // Move back to original position
      this.moveToPosition(this.props.particle.position, 500);
    } else if (
      newShell.shellType !== this.props.particle.shellType &&
      this.props.isMaxReached(newShell.shellType)
    ) {
      // Move back to original position
      this.moveToPosition(this.props.particle.position, 500);
    } else if (newShell.shellType === this.props.particle.shellType) {
      this.props.transferParticleToSameShell(
        this.props.particle,
        position,
        true,
      );
    } else {
      this.props.transferParticleToAnotherShell(
        this.props.particle,
        position,
        newShell.shellType,
        true,
      );
    }
  }

  private handleCommand(commandList: ObservableCommandList): void {
    while (commandList.commands.length > 0) {
      const command = assertExists(commandList.commands.shift());
      switch (command.kind) {
        case 'moveTo':
          this.moveToPosition(
            command.position,
            500,
            (): void => {
              command.state = 'completed';
            },
          );
          break;
      }
    }
  }

  private moveToPosition(
    position: { x: number; y: number },
    duration: number,
    callback?: () => void,
  ): void {
    Animated.timing(this.state.pan, {
      toValue: { x: position.x, y: position.y },
      useNativeDriver: true,
      duration,
      easing: Easing.elastic(1),
    }).start(
      (): void => {
        this.props.particle.position = position;

        if (typeof callback !== 'undefined') {
          callback();
        }
      },
    );
  }

  public componentDidMount(): void {
    this.unsubscribeHandleCommand = autorun(
      (): void => this.handleCommand(this.props.particle.commandList),
    );
  }

  public componentWillUnmount(): void {
    this.unsubscribeHandleCommand();
  }

  private getContainerStyle(): ViewStyle {
    return {
      height: config.atom.particleSize,
      width: config.atom.particleSize,
      borderRadius: config.atom.particleSize,
      backgroundColor:
        this.props.particle.color === 'highlighted'
          ? config.atom.primaryColor
          : config.atom.secondaryColor,
    };
  }

  public render(): React.ReactElement<any> {
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[
          this.styles.particle_container,
          this.getContainerStyle(),
          {
            transform: this.state.pan.getTranslateTransform(),
          },
        ]}>
        <DefaultText style={this.styles.character}>
          {this.props.particle.character}
        </DefaultText>
      </Animated.View>
    );
  }
}
