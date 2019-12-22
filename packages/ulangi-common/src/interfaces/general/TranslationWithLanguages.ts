/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface TranslationWithLanguages {
  readonly sourceText: string;
  readonly sourceLanguageCode: string;
  readonly translatedText: string;
  readonly translatedLanguageCode: string;
  readonly translatedBy: string;
}
