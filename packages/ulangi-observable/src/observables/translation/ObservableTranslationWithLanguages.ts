/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableTranslationWithLanguages {
  @observable
  public sourceText: string;

  @observable
  public sourceLanguageCode: string;

  @observable
  public translatedText: string;

  @observable
  public translatedLanguageCode: string;

  @observable
  public translatedBy: string;

  public constructor(
    sourceText: string,
    sourceLanguageCode: string,
    translatedText: string,
    translatedLanguageCode: string,
    translatedBy: string
  ) {
    this.sourceText = sourceText;
    this.sourceLanguageCode = sourceLanguageCode;
    this.translatedText = translatedText;
    this.translatedLanguageCode = translatedLanguageCode;
    this.translatedBy = translatedBy;
  }
}
