/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { AtomShellType } from '@ulangi/ulangi-common/enums';
import {
  ObservableAtomPlayScreen,
  ObservableParticle,
} from '@ulangi/ulangi-observable';
import * as changeCase from 'change-case';
import * as _ from 'lodash';
import { runInAction } from 'mobx';

import { AtomParticleDelegate } from './AtomParticleDelegate';

export class AtomAnswerDelegate {
  private observableScreen: ObservableAtomPlayScreen;
  private particleDelegate: AtomParticleDelegate;

  public constructor(
    observableScreen: ObservableAtomPlayScreen,
    particleDelegate: AtomParticleDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.particleDelegate = particleDelegate;
  }

  public checkAnswer(
    onAnswerCorrect: () => void,
    onAnswerIncorrect: () => void,
  ): void {
    runInAction(
      (): void => {
        this.particleDelegate.changeParticleColors(
          this.observableScreen.particles,
          'normal',
        );

        this.observableScreen.shells.forEach(
          (shell): void => {
            const correctParticles = this.getCorrectParticlesInOneShell(
              shell.shellType,
            );

            this.particleDelegate.changeParticleColors(
              correctParticles,
              'highlighted',
            );
          },
        );
      },
    );

    if (this.hasCorrectAnswer()) {
      onAnswerCorrect();
    } else {
      onAnswerIncorrect();
    }
  }

  public hasCorrectAnswer(
    _particles?: ObservableParticle[],
    _answer?: string,
  ): boolean {
    const particles = _particles || this.observableScreen.particles;
    const answer = _answer || this.observableScreen.question.answer;

    let hasCorrectAnswer = false;
    let i = 0;
    while (
      hasCorrectAnswer === false &&
      i < this.observableScreen.shells.length
    ) {
      const particlesInTheShell = this.particleDelegate.getParticlesInShell(
        this.observableScreen.shells[i].shellType,
        particles,
      );

      hasCorrectAnswer = this.particlesInOneShellHasCorrectAnswer(
        particlesInTheShell,
        answer,
      );
      i++;
    }

    return hasCorrectAnswer;
  }

  private particlesInOneShellHasCorrectAnswer(
    particles: ObservableParticle[],
    answer: string,
  ): boolean {
    if (this.particleDelegate.areParticlesInOneShellOnly(particles) === false) {
      throw new Error(
        'All particles in particlesInOneShellHasCorrectAnswer must be in one shell only',
      );
    }

    this.particleDelegate.reverseSortByIndex(particles);

    let found = false;
    let i = 0;
    while (i < particles.length && found === false) {
      const first = assertExists(
        particles.shift(),
        'Particle should not be null or undefined',
      );
      particles.push(first);
      const characters = particles.map(
        (particle): string => particle.character,
      );
      if (changeCase.upper(answer) === characters.join('')) {
        found = true;
      }

      i++;
    }

    return found;
  }

  public getCorrectParticlesInOneShell(
    shellType: AtomShellType,
  ): ObservableParticle[] {
    const correctSubsets = this.getCorrectParticleSubsetsInOneShell(shellType);

    return _.flatten(correctSubsets);
  }

  public getCorrectParticleSubsetsInOneShell(
    shellType: AtomShellType,
  ): ObservableParticle[][] {
    const particles = this.particleDelegate.getParticlesInShell(
      shellType,
      this.observableScreen.particles,
    );
    const answer = this.observableScreen.question.answer;

    this.particleDelegate.reverseSortByIndex(particles);

    const subsets: ObservableParticle[][] = [];
    let i = 0;
    while (i < particles.length) {
      let done = false;
      const subset: ObservableParticle[] = [];
      let j = i;
      while (j < i + particles.length && done === false) {
        const currentParticle = particles[j % particles.length];
        subset.push(currentParticle);

        if (subset.length >= 2) {
          const characterSubstring = subset
            .map((particle): string => particle.character)
            .join('');
          const result = this.isAnswerSubstring(characterSubstring, answer);
          if (result === false) {
            subset.pop();
            done = true;
            i = j - 1;
          } else if (result === true && j === i + particles.length - 1) {
            done = true;
            i = j;
          }

          if (done === true) {
            if (subset.length >= 2) {
              subsets.push(subset);
            }
          }
        }
        j++;
      }

      i++;
    }

    const first = _.first(subsets);
    const last = _.last(subsets);
    if (typeof first !== 'undefined' && typeof last !== 'undefined') {
      if (first !== last) {
        const difference = _.difference(last, first);
        // If this happens then the last is the subset of the first
        // Then we can replace the first by the last
        if (last.length === first.length + difference.length) {
          subsets[0] = last;
          subsets.pop();
        } else if (difference.length !== last.length) {
          // Replace the last by the difference
          if (difference.length >= 2) {
            subsets[subsets.length - 1] = difference;
          }
          // If difference is smaller than 2, than remove the last
          else {
            subsets.pop();
          }
        }
      }
    }

    return subsets;
  }

  private isAnswerSubstring(substring: string, answer: string): boolean {
    if (answer.indexOf(substring) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
