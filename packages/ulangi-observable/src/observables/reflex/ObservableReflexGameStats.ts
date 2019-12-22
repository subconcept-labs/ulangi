/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { action, observable } from 'mobx';

export class ObservableReflexGameStats {
  @observable
  public score: number;

  public constructor(score: number) {
    this.score = score;
  }

  @action
  public reset(score: number): void {
    this.score = score;
  }
}
