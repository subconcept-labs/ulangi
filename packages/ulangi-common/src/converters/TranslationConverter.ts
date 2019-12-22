/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyBuilder } from '../builders/VocabularyBuilder';
import { Translation } from '../interfaces/general/Translation';
import { TranslationWithLanguages } from '../interfaces/general/TranslationWithLanguages';
import { Vocabulary } from '../interfaces/general/Vocabulary';

export class TranslationConverter {
  private vocabularyBuilder = new VocabularyBuilder();

  public convertToTranslation(
    translation: TranslationWithLanguages,
    currentLearningLanguageCode: string,
    currentTranslatedToLanguageCode: string
  ): Translation {
    return {
      sourceText:
        currentLearningLanguageCode === translation.sourceLanguageCode
          ? translation.sourceText
          : translation.translatedText,
      translatedText:
        currentTranslatedToLanguageCode === translation.translatedLanguageCode
          ? translation.translatedText
          : translation.sourceText,
      translatedBy: translation.translatedBy,
    };
  }

  public convertToVocabulary(
    translation: Translation,
    categoryName?: string
  ): Vocabulary {
    const vocabularyText = translation.sourceText;

    const meaning = translation.translatedText;

    const category =
      typeof categoryName !== 'undefined' ? { categoryName } : undefined;

    return this.vocabularyBuilder.build({
      vocabularyText,
      definitions: [
        {
          meaning,
          source: translation.translatedBy,
        },
      ],
      category,
    });
  }
}
