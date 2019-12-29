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
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { AtomTutorialScreenFactory } from '../../factories/atom/AtomTutorialScreenFactory';
import { AtomStyle } from '../../styles/AtomStyle';
import { AtomTutorialScreen } from './AtomTutorialScreen';

@observer
export class AtomTutorialScreenContainer extends Container {
  public static options(): Options {
    return AtomStyle.getScreenStyle();
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

  private atomSettingsDelegate = this.atomTutorialScreenFactory.createAtomSettingsDelegate();

  protected observableScreen = new ObservableAtomTutorialScreen(
    0,
    new ObservableAtomGameState(false, false),
    new ObservableAtomGameStats(10, 0, 0),
    false,
    this.question,
    new ObservableOrigin(this.atomSettingsDelegate.getDefaultOriginPosition()),
    [],
    [],
    [],
    ScreenName.ATOM_TUTORIAL_SCREEN,
  );

  private screenDelegate = this.atomTutorialScreenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.initializeShellsAndParticles();
  }

  protected onThemeChanged(): void {
    _.noop();
  }

  public render(): React.ReactElement<any> {
    return (
      <AtomTutorialScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
