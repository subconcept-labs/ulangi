/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  AtomShellType,
  LightBoxState,
  ScreenName,
  ScreenState,
} from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableAtomPlayScreen,
  ObservableLightBox,
  ObservableParticle,
  ObservableShell,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { observable } from 'mobx';

import { ParticleFactory } from '../../factories/atom/ParticleFactory';
import { ShellFactory } from '../../factories/atom/ShellFactory';
import { AtomQuestionIterator } from '../../iterators/AtomQuestionIterator';
import { AtomStyle } from '../../styles/AtomStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { AtomAnswerDelegate } from './AtomAnswerDelegate';
import { AtomArcDelegate } from './AtomArcDelegate';
import { AtomOriginDelegate } from './AtomOriginDelegate';
import { AtomParticleDelegate } from './AtomParticleDelegate';
import { AtomShellDelegate } from './AtomShellDelegate';
import { FetchVocabularyDelegate } from './FetchVocabularyDelegate';

@boundClass
export class AtomPlayScreenDelegate {
  private particleFactory = new ParticleFactory();
  private shellFactory = new ShellFactory();

  private observer: Observer;
  private observableLightBox: ObservableLightBox;
  private observableScreen: ObservableAtomPlayScreen;
  private questionIterator: AtomQuestionIterator;
  private fetchVocabularyDelegate: FetchVocabularyDelegate;
  private originDelegate: AtomOriginDelegate;
  private particleDelegate: AtomParticleDelegate;
  private shellDelegate: AtomShellDelegate;
  private arcDelegate: AtomArcDelegate;
  private answerDelegate: AtomAnswerDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private startGame: () => void;

  public constructor(
    observer: Observer,
    observableLightBox: ObservableLightBox,
    observableScreen: ObservableAtomPlayScreen,
    questionIterator: AtomQuestionIterator,
    fetchVocabularyDelegate: FetchVocabularyDelegate,
    originDelegate: AtomOriginDelegate,
    particleDelegate: AtomParticleDelegate,
    shellDelegate: AtomShellDelegate,
    arcDelegate: AtomArcDelegate,
    answerDelegate: AtomAnswerDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
    startGame: () => void,
  ) {
    this.observer = observer;
    this.observableLightBox = observableLightBox;
    this.observableScreen = observableScreen;
    this.questionIterator = questionIterator;
    this.fetchVocabularyDelegate = fetchVocabularyDelegate;
    this.originDelegate = originDelegate;
    this.particleDelegate = particleDelegate;
    this.shellDelegate = shellDelegate;
    this.arcDelegate = arcDelegate;
    this.answerDelegate = answerDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.startGame = startGame;
  }

  public initializeShellsAndParticles(): void {
    this.observableScreen.shells = observable.array(this.makeShells());
    this.observableScreen.particles = observable.array(this.makeParticles());
    this.particleDelegate.spreadParticlesByIndices(
      (): void => this.checkAnswer(false),
    );
  }

  public clearGame(): void {
    this.clearFetchVocabulary();
  }

  public checkAnswer(isUserMove: boolean): void {
    this.answerDelegate.checkAnswer(
      (): void => this.onAnswerCorrect(isUserMove),
      (subsetsOfEachShell): void => {
        this.onAnswerIncorrect(isUserMove, subsetsOfEachShell);
      },
    );
  }

  private next(): void {
    if (!this.questionIterator.isDone()) {
      const nextQuestion = this.questionIterator.next();
      this.observableScreen.question.reset(
        nextQuestion.textWithUnderscores,
        nextQuestion.answer,
        nextQuestion.hint,
        nextQuestion.characterPool,
      );
      this.observableScreen.particles.replace(this.makeParticles().slice());

      this.particleDelegate.spreadParticlesByIndices(
        (): void => this.checkAnswer(false),
      );
    } else if (this.observableScreen.noMoreVocabulary === true) {
      this.gameOver('NO MORE VOCABULARY!');
    } else {
      this.wait();
    }

    if (this.observableScreen.noMoreVocabulary === false) {
      this.fetchVocabularyDelegate.fetchVocabularyIfBelowThreshold(
        this.questionIterator.getNumberOfQuestionLeft(),
        {
          onFetchSucceeded: (vocabularyList, noMore): void => {
            this.addVocabularyToQueue(vocabularyList);
            this.observableScreen.noMoreVocabulary = noMore;

            if (this.observableScreen.gameState.waitingForFetching === true) {
              this.dismissWaitingLightBoxAndNext();
            }
          },
        },
      );
    }
  }

  public wait(): void {
    this.observableScreen.gameState.waitingForFetching = true;
    this.showWaitingLightBox();
  }

  public pause(): void {
    this.showPauseLightBox();
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

  private makeParticles(): ObservableParticle[] {
    let particles: ObservableParticle[];

    // Avoid creating correct answer in the beginning
    do {
      particles = this.particleFactory.make(
        this.observableScreen.question.characterPool,
        this.observableScreen.origin.position,
      );
    } while (this.answerDelegate.hasCorrectAnswer(particles));

    return particles;
  }

  private makeShells(): ObservableShell[] {
    return this.shellFactory.make(this.observableScreen.origin.position);
  }

  private clearFetchVocabulary(): void {
    this.observableScreen.noMoreVocabulary = false;
    this.fetchVocabularyDelegate.clearFetch();
  }

  private gameOver(title: string): void {
    this.observableScreen.gameState.gameOver = true;
    this.showGameOverLightBox(
      title,
      this.observableScreen.gameStats.score,
      this.observableScreen.gameStats.correctCount,
    );
  }

  private restart(): void {
    this.quit();
    this.observer.when(
      (): boolean =>
        this.observableScreen.screenState === ScreenState.UNMOUNTED,
      (): void => this.startGame(),
    );
  }

  private quit(): void {
    this.clearGame();
    this.dialogDelegate.dismiss();
    this.observer.when(
      (): boolean => this.observableLightBox.state === LightBoxState.UNMOUNTED,
      (): void => this.navigatorDelegate.dismissScreen(),
    );
  }

  private showWaitingLightBox(): void {
    this.dialogDelegate.show({
      title: 'FETCHING VOCABULARY',
      message: 'Fetching more vocabulary. Please wait...',
    });
  }

  private dismissWaitingLightBoxAndNext(): void {
    this.observableScreen.gameState.waitingForFetching = false;
    this.dialogDelegate.dismiss();
    this.observer.when(
      (): boolean => this.observableLightBox.state === LightBoxState.UNMOUNTED,
      (): void => {
        this.next();
      },
    );
  }

  private showPauseLightBox(): void {
    this.navigatorDelegate.showLightBox(
      ScreenName.ATOM_PAUSED_SCREEN,
      {
        restart: this.restart,
        quit: this.quit,
      },
      AtomStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showGameOverLightBox(
    title: string,
    score: number,
    correctCount: number,
  ): void {
    this.navigatorDelegate.showLightBox(
      ScreenName.ATOM_GAME_OVER_SCREEN,
      {
        title,
        score,
        correctCount,
        restart: this.restart,
        quit: this.quit,
      },
      AtomStyle.LIGHT_BOX_SCREEN_STYLES,
    );
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
          this.observableScreen.gameStats.correctCount =
            this.observableScreen.gameStats.correctCount + 1;
        }

        this.next();
      },
    );

    this.originDelegate.bounceOrigin();
    this.arcDelegate.unhighlightArcs();
  }

  private onAnswerIncorrect(
    isUserMove: boolean,
    correctSubsetsOfEachShell: {
      shellType: AtomShellType;
      correctSubsets: ObservableParticle[][];
    }[],
  ): void {
    this.arcDelegate.unhighlightArcs();

    correctSubsetsOfEachShell.forEach(
      ({ shellType, correctSubsets }): void => {
        const shell = assertExists(
          this.observableScreen.shells.find(
            (currentShell): boolean => currentShell.shellType === shellType,
          ),
          'shell should not be null or undefined',
        );

        this.arcDelegate.highlightArcs(correctSubsets, shell.diameter / 2);
      },
    );

    // Only decrement move when user moves
    if (
      isUserMove === true &&
      this.observableScreen.gameStats.remainingMoves > 0
    ) {
      this.observableScreen.gameStats.remainingMoves =
        this.observableScreen.gameStats.remainingMoves - 1;
    }

    if (this.observableScreen.gameStats.remainingMoves === 0) {
      this.gameOver('NO MOVES LEFT!');
    }
  }

  private addVocabularyToQueue(vocabularyList: readonly Vocabulary[]): void {
    this.questionIterator.merge(
      new Map(
        vocabularyList.map(
          (vocabulary): [string, Vocabulary] => [
            vocabulary.vocabularyId,
            vocabulary,
          ],
        ),
      ),
    );
    this.questionIterator.shuffleQueue();
  }
}
