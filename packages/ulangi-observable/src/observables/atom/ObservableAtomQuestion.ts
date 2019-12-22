/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IObservableArray, action, observable } from 'mobx';

export class ObservableAtomQuestion {
  @observable
  public textWithUnderscores: string;

  @observable
  public answer: string;

  @observable
  public hint: string;

  @observable
  public characterPool: IObservableArray<string>;

  public constructor(
    textWithUnderscores: string,
    answer: string,
    hint: string,
    characterPool: IObservableArray<string>
  ) {
    this.textWithUnderscores = textWithUnderscores;
    this.answer = answer;
    this.hint = hint;
    this.characterPool = characterPool;
  }

  @action
  public reset(
    textWithUnderscores: string,
    answer: string,
    hint: string,
    characterPool: IObservableArray<string>
  ): void {
    this.textWithUnderscores = textWithUnderscores;
    this.answer = answer;
    this.hint = hint;
    this.characterPool = characterPool;
  }
}
