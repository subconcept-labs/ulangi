/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableAtomGameState,
  ObservableAtomGameStats,
  ObservableAtomPlayScreen,
  ObservableOrigin,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { config } from '../../constants/config';
import { AtomPlayScreenFactory } from '../../factories/atom/AtomPlayScreenFactory';
import { AtomQuestionIterator } from '../../iterators/AtomQuestionIterator';
import { AtomStyle } from '../../styles/AtomStyle';
import { AtomPlayScreen } from './AtomPlayScreen';

export interface AtomPlayScreenPassedProps {
  readonly firstVocabularyBatch: readonly Vocabulary[];
  readonly noMoreVocabulary: boolean;
  readonly startGame: () => void;
}

@observer
export class AtomPlayScreenContainer extends Container<
  AtomPlayScreenPassedProps
> {
  public static options(): Options {
    return AtomStyle.getScreenStyle({
      popGesture: false,
    });
  }

  private atomPlayScreenFactory = new AtomPlayScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private questionIterator = new AtomQuestionIterator(
    new Map(
      this.props.passedProps.firstVocabularyBatch.map(
        (vocabulary): [string, Vocabulary] => [
          vocabulary.vocabularyId,
          vocabulary,
        ],
      ),
    ),
  );

  protected observableScreen = new ObservableAtomPlayScreen(
    new ObservableAtomGameState(false, false),
    new ObservableAtomGameStats(10, 0, 0),
    this.props.passedProps.noMoreVocabulary,
    this.questionIterator.next(),
    new ObservableOrigin(
      this.props.observableDimensions,
      config.atom.bottomOffset,
      config.atom.outerShellDiameter,
      config.atom.particleSize,
    ),
    [],
    [],
    [],
    this.props.componentId,
    ScreenName.ATOM_PLAY_SCREEN,
  );

  private screenDelegate = this.atomPlayScreenFactory.createScreenDelegate(
    this.observableScreen,
    this.questionIterator,
    this.props.passedProps.startGame,
  );

  public componentWillUnmount(): void {
    this.screenDelegate.clearGame();
  }

  public componentDidMount(): void {
    this.screenDelegate.initializeShellsAndParticles();
    this.screenDelegate.autoMoveParticlesOnOriginPositionChange();
  }

  protected onThemeChanged(): void {
    _.noop();
  }

  public render(): React.ReactElement<any> {
    return (
      <AtomPlayScreen
        observableScreen={this.observableScreen}
        observableDimensions={this.props.observableDimensions}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
