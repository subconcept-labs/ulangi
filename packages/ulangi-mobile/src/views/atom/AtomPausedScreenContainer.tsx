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

import { Container } from '../../Container';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { atomStyles } from '../../styles/AtomStyles';
import { AtomPausedScreen } from './AtomPausedScreen';

export interface AtomPausedScreenPassedProps {
  readonly restart: () => void;
  readonly quit: () => void;
  readonly onClose?: () => void;
}

@observer
export class AtomPausedScreenContainer extends Container<
  AtomPausedScreenPassedProps
> {
  public static options(): Options {
    return atomStyles.getScreenStyle();
  }

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.ATOM_PAUSED_SCREEN,
    null,
  );

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected onThemeChanged(): void {
    _.noop();
  }

  public render(): React.ReactElement<any> {
    return (
      <AtomPausedScreen
        themeStore={this.props.rootStore.themeStore}
        observableLightBox={this.props.observableLightBox}
        observableScreen={this.observableScreen}
        restart={this.props.passedProps.restart}
        quit={this.props.passedProps.quit}
        close={(): void => this.navigatorDelegate.dismissLightBox()}
        onClose={this.props.passedProps.onClose}
      />
    );
  }
}
