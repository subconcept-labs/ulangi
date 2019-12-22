/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

interface VocabularyWithDefinitions {
  readonly definitions: readonly { meaning: string }[];
}

export function removePointlessMeanings<T extends VocabularyWithDefinitions>(
  vocabulary: T
): T {
  return {
    ...vocabulary,
    definitions: vocabulary.definitions.filter(
      (definition: { meaning: string }): boolean => {
        return (
          definition.meaning !== '' &&
          definition.meaning !== '.' &&
          !definition.meaning.includes('rfdef') &&
          !definition.meaning.includes('Lua error') &&
          !definition.meaning.includes('Can we verify') &&
          !definition.meaning.includes('Only used in') &&
          !definition.meaning.startsWith('A given female name') &&
          !definition.meaning.startsWith('A given male name') &&
          !definition.meaning.includes('Template:') &&
          !definition.meaning.includes('redirectTemplate') &&
          !definition.meaning.includes('REDIRECT template:link') &&
          // In most Chinese words
          !definition.meaning.startsWith('A surname') &&
          !definition.meaning.startsWith('A  surname') &&
          // In Vietnamese
          !definition.meaning.includes('Hán tự form')
        );
      }
    ),
  };
}
