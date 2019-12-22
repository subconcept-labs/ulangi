/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';

export class LanguageConverter {
  private languageMap: { [P in string]: string };

  public constructor(languageMap: { [P in string]: string }) {
    this.languageMap = languageMap;
  }

  public convertToLanguageName(languageCode: string): string {
    return assertExists(this.languageMap[languageCode]);
  }
}
