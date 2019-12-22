/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BackHandler } from 'react-native';

import { Container } from '../../Container';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { AtomStyle } from '../../styles/AtomStyle';
import { AtomGameOverScreen } from './AtomGameOverScreen';

export interface AtomGameOverScreenPassedProps {
  readonly title: string;
  readonly score: number;
  readonly correctCount: number;
  readonly quit: () => void;
  readonly restart: () => void;
}

@observer
export class AtomGameOverScreenContainer extends Container<
  AtomGameOverScreenPassedProps
> {
  public static options(): Options {
    return AtomStyle.getScreenStyle();
  }

  protected observableLightBox = this.props.observableLightBox;

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  public componentDidMount(): void {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  public componentWillUnmount(): void {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  private handleBackButton = (): boolean => {
    this.navigatorDelegate.dismissLightBox();
    this.props.passedProps.quit();
    return true;
  };

  protected onThemeChanged(): void {
    _.noop();
  }

  public render(): React.ReactElement<any> {
    return (
      <AtomGameOverScreen
        observableLightBox={this.props.observableLightBox}
        title={this.props.passedProps.title}
        score={this.props.passedProps.score}
        correctCount={this.props.passedProps.correctCount}
        quit={this.props.passedProps.quit}
        restart={this.props.passedProps.restart}
      />
    );
  }
}
