/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export class SpacedRepetitionSequenceStrategy {
  public getLevelByTermPosition(termPosition: number): number {
    if (termPosition < 0) {
      throw new Error('termPosition should be equal or greater than 0');
    }

    const appearanceCount: number[] = [];

    // First term is zero
    let currentTermValue = 0;
    appearanceCount[0] = 1;

    for (let i = 1; i <= termPosition; i++) {
      if (appearanceCount[currentTermValue] % 2 === 0) {
        currentTermValue++;
        if (typeof appearanceCount[currentTermValue] === 'undefined') {
          appearanceCount[currentTermValue] = 1;
        } else {
          appearanceCount[currentTermValue]++;
        }
      } else {
        currentTermValue = 0;
        appearanceCount[0]++;
      }
    }

    return currentTermValue;
  }
}
