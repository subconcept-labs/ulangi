/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { NativeSet, PublicSet } from '@ulangi/ulangi-common/interfaces';

import { PublicVocabularyConverter } from './PublicVocabularyConverter';

export class PublicSetConverter {
  private publicVocabularyConverter = new PublicVocabularyConverter();

  public convertToNativeSets(
    publicSets: PublicSet[],
    languageCodePair: string
  ): NativeSet[] {
    return publicSets.map(
      (publicSet): NativeSet => {
        return {
          nativeSetId: publicSet.publicSetId,
          languageCodePair,
          title: publicSet.title,
          subtitle: publicSet.subtitle,
          difficulty: publicSet.difficulty,
          tags: publicSet.tags,
          author:
            typeof publicSet.authors[0] !== 'undefined'
              ? publicSet.authors[0].name
              : undefined,
          link:
            typeof publicSet.authors[0] !== 'undefined'
              ? publicSet.authors[0].link
              : undefined,
          vocabularyList: this.publicVocabularyConverter.convertToNativeVocabularyList(
            publicSet.vocabularyList.slice()
          ),
        };
      }
    );
  }
}
