/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableReflexQuestion {
  @observable
  public vocabularyTerm: string;

  @observable
  public randomMeaning: string;

  @observable
  public correctMeaning: string;

  public constructor(
    vocabularyTerm: string,
    randomMeaning: string,
    correctMeaning: string
  ) {
    this.vocabularyTerm = vocabularyTerm;
    this.randomMeaning = randomMeaning;
    this.correctMeaning = correctMeaning;
  }
}
