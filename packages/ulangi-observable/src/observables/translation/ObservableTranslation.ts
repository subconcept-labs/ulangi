/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableTranslation {
  @observable
  public sourceText: string;

  @observable
  public translatedText: string;

  @observable
  public translatedBy: string;

  @observable
  public isAdded: boolean;

  public constructor(
    sourceText: string,
    translatedText: string,
    translatedBy: string,
    isAdded: boolean
  ) {
    this.sourceText = sourceText;
    this.translatedText = translatedText;
    this.translatedBy = translatedBy;
    this.isAdded = isAdded;
  }
}
