/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { AtomShellType } from '@ulangi/ulangi-common/enums';
import {
  ObservableAtomTutorialScreen,
  ObservableParticle,
  ObservableShell,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { observable } from 'mobx';
import * as uuid from 'uuid';

import { config } from '../../constants/config';
import { AtomShellDelegate } from '../../delegates/atom/AtomShellDelegate';
import { NavigatorDelegate } from '../../delegates/navigator/navigatorDelegate';
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
    navigatorDelegate: NavigatorDelegate
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
      this.makeParticles().slice()
    );
    this.particleDelegate.spreadParticlesByIndices(
      (): void => this.checkAnswer(false)
    );
  }

  public checkAnswer(isUserMove: boolean): void {
    this.answerDelegate.checkAnswer(
      (): void => this.onAnswerCorrect(isUserMove),
      (subsetsOfEachShell): void => {
        this.onAnswerIncorrect(isUserMove, subsetsOfEachShell);
      }
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
    isUserMove: boolean
  ): void {
    return this.particleDelegate.transferParticleToAnotherShell(
      particle,
      newPosition,
      newShell,
      (): void => this.checkAnswer(isUserMove)
    );
  }

  public transferParticleToSameShell(
    particle: ObservableParticle,
    newPosition: { x: number; y: number },
    isUserMove: boolean
  ): void {
    return this.particleDelegate.transferParticleToSameShell(
      particle,
      newPosition,
      (): void => this.checkAnswer(isUserMove)
    );
  }

  public isMaxReached(shellType: AtomShellType): boolean {
    return this.particleDelegate.isMaxReached(shellType);
  }

  public back(): void {
    this.navigatorDelegate.pop();
  }

  private makeParticles(): readonly ObservableParticle[] {
    const initialPosition = {
      x: this.observableScreen.origin.position.x - config.atom.particleSize / 2,
      y: this.observableScreen.origin.position.y - config.atom.particleSize / 2,
    };
    return [
      new ObservableParticle(
        uuid.v4(),
        false,
        'A',
        initialPosition,
        AtomShellType.OUTER,
        0,
        'normal'
      ),
      new ObservableParticle(
        uuid.v4(),
        false,
        'O',
        initialPosition,
        AtomShellType.OUTER,
        4,
        'normal'
      ),
      new ObservableParticle(
        uuid.v4(),
        false,
        'M',
        initialPosition,
        AtomShellType.OUTER,
        3,
        'normal'
      ),
      new ObservableParticle(
        uuid.v4(),
        false,
        'K',
        initialPosition,
        AtomShellType.OUTER,
        2,
        'normal'
      ),
      new ObservableParticle(
        uuid.v4(),
        true,
        'T',
        initialPosition,
        AtomShellType.OUTER,
        1,
        'normal'
      ),
    ];
  }

  private makeShells(): readonly ObservableShell[] {
    return this.shellFactory.make(this.observableScreen.origin.position);
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
      }
    );

    this.originDelegate.bounceOrigin();
  }

  private onAnswerIncorrect(
    isUserMove: boolean,
    correctSubsetsOfEachShell: {
      shellType: AtomShellType;
      correctSubsets: ObservableParticle[][];
    }[]
  ): void {
    if (
      isUserMove === true &&
      this.observableScreen.gameStats.remainingMoves > 0
    ) {
      this.observableScreen.gameStats.remainingMoves =
        this.observableScreen.gameStats.remainingMoves - 1;
    }

    this.arcDelegate.unhighlightArcs();

    correctSubsetsOfEachShell.forEach(
      ({ shellType, correctSubsets }): void => {
        const shell = assertExists(
          this.observableScreen.shells.find(
            (shell): boolean => shell.shellType === shellType
          ),
          'shell should not be null or undefined'
        );

        this.arcDelegate.highlightArcs(correctSubsets, shell.diameter / 2);
      }
    );

    // If user has the correct answer eventhough there are redundant particles, then go to step 2
    if (this.answerDelegate.hasCorrectAnswerDespiteRedundantParticles()) {
      this.step2();
    }
  }

  private step2(): void {
    this.observableScreen.currentStep = 1;
    this.particleDelegate.getParticleByCharacter('K').enabled = true;
    this.particleDelegate.getParticleByCharacter('T').enabled = false;
  }

  private step3(): void {
    this.observableScreen.currentStep = 2;
  }
}
