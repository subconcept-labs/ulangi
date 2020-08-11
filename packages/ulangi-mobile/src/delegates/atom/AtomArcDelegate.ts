/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableArc,
  ObservableAtomPlayScreen,
  Observer,
} from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';
import { AtomAnswerDelegate } from './AtomAnswerDelegate';

export class AtomArcDelegate {
  private observer: Observer;
  private observableScreen: ObservableAtomPlayScreen;
  private answerDelegate: AtomAnswerDelegate;

  public constructor(
    observer: Observer,
    observableScreen: ObservableAtomPlayScreen,
    answerDelegate: AtomAnswerDelegate,
  ) {
    this.observer = observer;
    this.observableScreen = observableScreen;
    this.answerDelegate = answerDelegate;
  }

  public highlightArcs(): void {
    const newArcs: ObservableArc[] = [];

    this.observableScreen.shells.forEach(
      (shell): void => {
        const subsets = this.answerDelegate.getCorrectParticleSubsetsInOneShell(
          shell.shellType,
        );
        const radius = shell.diameter / 2;

        subsets.forEach(
          (subset): void => {
            subset.forEach(
              (particle, index): void => {
                if (index !== subset.length - 1) {
                  const nextParticle = subset[index + 1];
                  newArcs.push(
                    new ObservableArc(
                      {
                        x: particle.position.x + config.atom.particleSize / 2,
                        y: particle.position.y + config.atom.particleSize / 2,
                      },
                      {
                        x:
                          nextParticle.position.x +
                          config.atom.particleSize / 2,
                        y:
                          nextParticle.position.y +
                          config.atom.particleSize / 2,
                      },
                      radius,
                    ),
                  );
                }
              },
            );
          },
        );

        this.observableScreen.arcs.push(...newArcs);
      },
    );
  }

  public unhighlightArcs(): void {
    this.observableScreen.arcs.clear();
  }

  public resetHighlightArcs(): void {
    this.unhighlightArcs();
    this.highlightArcs();
  }

  public autoUnhighlightArcsOnOriginPositionChange(): void {
    this.observer.reaction(
      (): { x: number; y: number } => this.observableScreen.origin.position,
      (): void => {
        this.unhighlightArcs();
      },
    );
  }
}
