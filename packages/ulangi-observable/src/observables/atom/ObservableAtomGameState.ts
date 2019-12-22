/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableAtomGameState {
  @observable
  public gameOver: boolean;

  @observable
  public waitingForFetching: boolean;

  public constructor(gameOver: boolean, waitingForFetching: boolean) {
    this.gameOver = gameOver;
    this.waitingForFetching = waitingForFetching;
  }
}
