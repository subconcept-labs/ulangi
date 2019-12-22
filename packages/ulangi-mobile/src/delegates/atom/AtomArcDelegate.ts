/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableArc,
  ObservableAtomPlayScreen,
  ObservableParticle,
} from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class AtomArcDelegate {
  private observableScreen: ObservableAtomPlayScreen;

  public constructor(observableScreen: ObservableAtomPlayScreen) {
    this.observableScreen = observableScreen;
  }

  public highlightArcs(subsets: ObservableParticle[][], radius: number): void {
    const newArcs: ObservableArc[] = [];
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
                    x: nextParticle.position.x + config.atom.particleSize / 2,
                    y: nextParticle.position.y + config.atom.particleSize / 2,
                  },
                  radius
                )
              );
            }
          }
        );
      }
    );

    this.observableScreen.arcs.push(...newArcs);
  }

  public unhighlightArcs(): void {
    this.observableScreen.arcs.clear();
  }
}
