/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableAtomGameState,
  ObservableAtomGameStats,
  ObservableAtomQuestion,
  ObservableAtomTutorialScreen,
  ObservableOrigin,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { config } from '../../constants/config';
import { AtomTutorialScreenFactory } from '../../factories/atom/AtomTutorialScreenFactory';
import { atomStyles } from '../../styles/AtomStyles';
import { AtomTutorialScreen } from './AtomTutorialScreen';

@observer
export class AtomTutorialScreenContainer extends Container {
  public static options(): Options {
    return atomStyles.getScreenStyle();
  }

  private atomTutorialScreenFactory = new AtomTutorialScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private question = new ObservableAtomQuestion(
    '____',
    'ATOM',
    '',
    observable.array(['A', 'T', 'O', 'M', 'K']),
  );

  private screenLayout = new ObservableScreenLayout(0, 0);

  protected observableScreen = new ObservableAtomTutorialScreen(
    0,
    new ObservableAtomGameState(false, false),
    new ObservableAtomGameStats(10, 0, 0),
    false,
    this.question,
    new ObservableOrigin(
      this.screenLayout,
      config.atom.bottomOffset,
      config.atom.outerShellDiameter,
      config.atom.particleSize,
    ),
    [],
    [],
    [],
    this.props.componentId,
    ScreenName.ATOM_TUTORIAL_SCREEN,
    this.screenLayout,
  );

  private screenDelegate = this.atomTutorialScreenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.initializeShellsAndParticles();
    this.screenDelegate.autoUnhighlightArcsOnOriginPositionChange();
    this.screenDelegate.autoMoveParticlesOnOriginPositionChange();
  }

  protected onThemeChanged(): void {
    _.noop();
  }

  public render(): React.ReactElement<any> {
    return (
      <AtomTutorialScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
