/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreenLayout } from '../screen/ObservableScreenLayout';
import { ObservableArc } from './ObservableArc';
import { ObservableAtomGameState } from './ObservableAtomGameState';
import { ObservableAtomGameStats } from './ObservableAtomGameStats';
import { ObservableAtomPlayScreen } from './ObservableAtomPlayScreen';
import { ObservableAtomQuestion } from './ObservableAtomQuestion';
import { ObservableOrigin } from './ObservableOrigin';
import { ObservableParticle } from './ObservableParticle';
import { ObservableShell } from './ObservableShell';

export class ObservableAtomTutorialScreen extends ObservableAtomPlayScreen {
  @observable
  public currentStep: number;

  public constructor(
    currentStep: number,
    gameState: ObservableAtomGameState,
    gameStats: ObservableAtomGameStats,
    noMoreVocabulary: boolean,
    question: ObservableAtomQuestion,
    origin: ObservableOrigin,
    arcs: readonly ObservableArc[],
    particles: readonly ObservableParticle[],
    shells: readonly ObservableShell[],
    componentId: string,
    screenName: ScreenName,
    screenLayout: ObservableScreenLayout
  ) {
    super(
      gameState,
      gameStats,
      noMoreVocabulary,
      question,
      origin,
      arcs,
      particles,
      shells,
      componentId,
      screenName,
      screenLayout
    );
    this.currentStep = currentStep;
  }
}
