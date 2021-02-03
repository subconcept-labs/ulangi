/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AtomShellType } from '@ulangi/ulangi-common/enums';
import {
  ObservableAtomTutorialScreen,
  ObservableParticle,
  ObservableShell,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';
import { observable } from 'mobx';
import * as uuid from 'uuid';

import { config } from '../../constants/config';
import { AtomShellDelegate } from '../../delegates/atom/AtomShellDelegate';
import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';
import { ShellFactory } from '../../factories/atom/ShellFactory';
import { AtomAnswerDelegate } from './AtomAnswerDelegate';
import { AtomArcDelegate } from './AtomArcDelegate';
import { AtomOriginDelegate } from './AtomOriginDelegate';
import { AtomParticleDelegate } from './AtomParticleDelegate';

@boundClass
export class AtomTutorialScreenDelegate {
  private shellFactory = new ShellFactory();

  private observableScreen: ObservableAtomTutorialScreen;
  private originDelegate: AtomOriginDelegate;
  private particleDelegate: AtomParticleDelegate;
  private shellDelegate: AtomShellDelegate;
  private arcDelegate: AtomArcDelegate;
  private answerDelegate: AtomAnswerDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableAtomTutorialScreen,
    originDelegate: AtomOriginDelegate,
    particleDelegate: AtomParticleDelegate,
    shellDelegate: AtomShellDelegate,
    arcDelegate: AtomArcDelegate,
    answerDelegate: AtomAnswerDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.originDelegate = originDelegate;
    this.particleDelegate = particleDelegate;
    this.shellDelegate = shellDelegate;
    this.arcDelegate = arcDelegate;
    this.answerDelegate = answerDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public initializeShellsAndParticles(): void {
    this.observableScreen.shells = observable.array(this.makeShells().slice());
    this.observableScreen.particles = observable.array(
      this.makeParticles().slice(),
    );
    this.particleDelegate.spreadParticlesByIndices(
      (): void => this.checkAnswer(false),
    );
  }

  public autoMoveParticlesOnOriginPositionChange(): void {
    this.particleDelegate.autoMoveParticlesOnOriginPositionChange(
      (): void => {
        this.arcDelegate.resetHighlightArcs();
      },
    );
  }

  public autoUnhighlightArcsOnOriginPositionChange(): void {
    this.arcDelegate.autoUnhighlightArcsOnOriginPositionChange();
  }

  public checkAnswer(isUserMove: boolean): void {
    this.answerDelegate.checkAnswer(
      (): void => this.onAnswerCorrect(isUserMove),
      (): void => {
        this.onAnswerIncorrect(isUserMove);
      },
    );
  }

  public getShellByPosition(position: {
    x: number;
    y: number;
  }): ObservableShell | undefined {
    return this.shellDelegate.getShellByPosition(position);
  }

  public transferParticleToAnotherShell(
    particle: ObservableParticle,
    newPosition: { x: number; y: number },
    newShell: AtomShellType,
    isUserMove: boolean,
  ): void {
    return this.particleDelegate.transferParticleToAnotherShell(
      particle,
      newPosition,
      newShell,
      (): void => this.checkAnswer(isUserMove),
    );
  }

  public transferParticleToSameShell(
    particle: ObservableParticle,
    newPosition: { x: number; y: number },
    isUserMove: boolean,
  ): void {
    return this.particleDelegate.transferParticleToSameShell(
      particle,
      newPosition,
      (): void => this.checkAnswer(isUserMove),
    );
  }

  public isMaxReached(shellType: AtomShellType): boolean {
    return this.particleDelegate.isMaxReached(shellType);
  }

  public back(): void {
    this.navigatorDelegate.dismissScreen();
  }

  private makeParticles(): readonly ObservableParticle[] {
    const initialPosition = {
      x: this.observableScreen.origin.position.x - config.atom.particleSize / 2,
      y: this.observableScreen.origin.position.y - config.atom.particleSize / 2,
    };
    return [
      new ObservableParticle(
        uuid.v4(),
        true,
        'A',
        initialPosition,
        AtomShellType.OUTER,
        0,
        'normal',
      ),
      new ObservableParticle(
        uuid.v4(),
        true,
        'O',
        initialPosition,
        AtomShellType.OUTER,
        4,
        'normal',
      ),
      new ObservableParticle(
        uuid.v4(),
        true,
        'M',
        initialPosition,
        AtomShellType.OUTER,
        3,
        'normal',
      ),
      new ObservableParticle(
        uuid.v4(),
        true,
        'K',
        initialPosition,
        AtomShellType.OUTER,
        2,
        'normal',
      ),
      new ObservableParticle(
        uuid.v4(),
        true,
        'T',
        initialPosition,
        AtomShellType.OUTER,
        1,
        'normal',
      ),
    ];
  }

  private makeShells(): readonly ObservableShell[] {
    return this.shellFactory.make(this.observableScreen.origin);
  }

  private onAnswerCorrect(isUserMove: boolean): void {
    this.particleDelegate.moveAllParticlesToOrigin(
      (): void => {
        if (isUserMove === true) {
          this.observableScreen.gameStats.remainingMoves =
            this.observableScreen.gameStats.remainingMoves +
            this.observableScreen.particles.length;
          this.observableScreen.gameStats.score =
            this.observableScreen.gameStats.score +
            this.observableScreen.particles.length;
        }

        this.step3();
      },
    );

    this.originDelegate.bounceOrigin();
  }

  private onAnswerIncorrect(isUserMove: boolean): void {
    if (
      isUserMove === true &&
      this.observableScreen.gameStats.remainingMoves > 0
    ) {
      this.observableScreen.gameStats.remainingMoves =
        this.observableScreen.gameStats.remainingMoves - 1;
    }

    this.arcDelegate.resetHighlightArcs();

    this.observableScreen.shells.forEach(
      (shell): void => {
        const correctSubsets = this.answerDelegate.getCorrectParticleSubsetsInOneShell(
          shell.shellType,
        );

        const currentAnswers = correctSubsets.map(
          (particles): string => {
            return particles
              .map(
                (particle): string => {
                  return particle.character;
                },
              )
              .join('');
          },
        );

        if (_.includes(currentAnswers, this.observableScreen.question.answer)) {
          this.step2();
        }
      },
    );
  }

  private step2(): void {
    this.observableScreen.currentStep = 1;
  }

  private step3(): void {
    this.observableScreen.currentStep = 2;
  }
}
