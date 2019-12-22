/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableLanguage {
  @observable
  public languageCode: string;

  @observable
  public fullName: string;

  public constructor(languageCode: string, fullName: string) {
    this.languageCode = languageCode;
    this.fullName = fullName;
  }
}
