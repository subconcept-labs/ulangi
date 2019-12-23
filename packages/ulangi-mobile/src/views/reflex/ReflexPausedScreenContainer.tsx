/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BackHandler } from 'react-native';

import { Container } from '../../Container';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { ReflexStyle } from '../../styles/ReflexStyle';
import { ReflexPausedScreen } from './ReflexPausedScreen';

export interface ReflexPausedScreenPassedProps {
  readonly continue: () => void;
  readonly restart: () => void;
  readonly quit: () => void;
}

@observer
export class ReflexPausedScreenContainer extends Container<
  ReflexPausedScreenPassedProps
> {
  public static options(): Options {
    return ReflexStyle.getScreenStyle();
  }

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    ScreenName.REFLEX_PAUSED_SCREEN,
  );

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
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
    this.props.passedProps.continue();
    return true;
  };

  protected onThemeChanged(): void {
    _.noop();
  }

  public render(): React.ReactElement<any> {
    return (
      <ReflexPausedScreen
        observableLightBox={this.props.observableLightBox}
        continue={this.props.passedProps.continue}
        restart={this.props.passedProps.restart}
        quit={this.props.passedProps.quit}
      />
    );
  }
}
