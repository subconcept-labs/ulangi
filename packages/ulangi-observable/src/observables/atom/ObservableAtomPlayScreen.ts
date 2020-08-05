/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableArray, computed, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableScreenLayout } from '../screen/ObservableScreenLayout';
import { ObservableArc } from './ObservableArc';
import { ObservableAtomGameState } from './ObservableAtomGameState';
import { ObservableAtomGameStats } from './ObservableAtomGameStats';
import { ObservableAtomQuestion } from './ObservableAtomQuestion';
import { ObservableOrigin } from './ObservableOrigin';
import { ObservableParticle } from './ObservableParticle';
import { ObservableShell } from './ObservableShell';

export class ObservableAtomPlayScreen extends ObservableScreen {
  @observable
  public gameState: ObservableAtomGameState;

  @observable
  public gameStats: ObservableAtomGameStats;

  @observable
  public noMoreVocabulary: boolean;

  @observable
  public question: ObservableAtomQuestion;

  @observable
  public origin: ObservableOrigin;

  @observable
  public arcs: IObservableArray<ObservableArc>;

  @observable
  public shells: IObservableArray<ObservableShell>;

  @observable
  public particles: IObservableArray<ObservableParticle>;

  @computed
  public get outerShell(): ObservableShell {
    return assertExists(
      this.shells.find((shell): boolean => shell.shellType === 'OUTER'),
      'outerShell should not be null or undefined'
    );
  }

  @computed
  public get innerShell(): ObservableShell {
    return assertExists(
      this.shells.find((shell): boolean => shell.shellType === 'INNER'),
      'innerShell should not be null or undefined'
    );
  }

  @computed
  public get particlesInOuterShell(): readonly ObservableParticle[] {
    return this.particles.filter(
      (particle): boolean => particle.shellType === 'OUTER'
    );
  }

  @computed
  public get particlesInInnerShell(): readonly ObservableParticle[] {
    return this.particles.filter(
      (particle): boolean => particle.shellType === 'INNER'
    );
  }

  public constructor(
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
    super(componentId, screenName, null, screenLayout);
    this.gameState = gameState;
    this.gameStats = gameStats;
    this.noMoreVocabulary = noMoreVocabulary;
    this.question = question;
    this.origin = origin;
    this.arcs = observable.array(arcs.slice());
    this.shells = observable.array(shells.slice());
    this.particles = observable.array(particles.slice());
  }
}
