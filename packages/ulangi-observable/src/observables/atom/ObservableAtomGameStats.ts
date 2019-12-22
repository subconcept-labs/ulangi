/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableAtomGameStats {
  @observable
  public remainingMoves: number;

  @observable
  public score: number;

  @observable
  public correctCount: number;

  public constructor(
    remainingMoves: number,
    score: number,
    correctCount: number
  ) {
    this.remainingMoves = remainingMoves;
    this.score = score;
    this.correctCount = correctCount;
  }
}
