/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import * as _ from 'lodash';
import { computed, observable } from 'mobx';

export class ObservableMultipleChoiceResult {
  @observable
  public correctAttempts: number;

  @observable
  public incorrectAttempts: number;

  @computed
  public get correctPercentage(): null | number {
    const total = this.correctAttempts + this.incorrectAttempts;
    return total === 0
      ? null
      : Math.round((this.correctAttempts / total) * 100);
  }

  @computed
  public get grade(): string {
    const correctPercentage = this.correctPercentage;
    if (correctPercentage === null) {
      return 'N/A';
    } else {
      const grade = _.findKey(
        this.gradeScale,
        ([lower, upper]): boolean =>
          correctPercentage >= lower && correctPercentage <= upper
      );
      return assertExists(grade, 'grade should not be null or undefined');
    }
  }

  private gradeScale: { [P in string]: [number, number] };

  public constructor(
    gradeScale: { [P in string]: [number, number] },
    correctAttempts: number,
    incorrectAttempts: number
  ) {
    this.correctAttempts = correctAttempts;
    this.incorrectAttempts = incorrectAttempts;
    this.gradeScale = gradeScale;
  }
}
