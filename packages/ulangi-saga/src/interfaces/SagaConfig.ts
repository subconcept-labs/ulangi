/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface SagaConfig {
  readonly env: {
    readonly apiUrl: string;
    readonly googlePackageName: string;
    readonly flashcardPlayerUrl: string;
  };

  readonly general: {
    readonly guestEmailDomain: string;
    readonly guestPassword: string;
    readonly checkDatabaseTimeout: number;
  };

  readonly user: {
    readonly passwordMinLength: number;
  };

  readonly vocabulary: {
    readonly fetchLimit: number;
  };

  readonly category: {
    readonly fetchSuggestionsLimit: number;
  };

  readonly search: {
    readonly searchLimit: number;
  };

  readonly manage: {
    readonly fetchVocabularyLimit: number;
    readonly fetchCategoryLimit: number;
  };

  readonly library: {
    readonly fetchPublicSetLimit: number;
    readonly searchPublicSetLimit: number;
    readonly searchPublicVocabularyLimit: number;
  };

  readonly spacedRepetition: {
    readonly minPerLesson: number;
    readonly maxLevel: number;
  };

  readonly writing: {
    readonly minPerLesson: number;
    readonly maxLevel: number;
  };

  readonly atom: {
    readonly minToPlay: number;
    readonly fetchLimit: number;
  };

  readonly reflex: {
    readonly minToPlay: number;
    readonly fetchLimit: number;
  };

  readonly flashcardPlayer: {
    readonly minToPlay: number;
    readonly uploadLimit: number;
  };

  readonly quiz: {
    readonly minPerWritingQuiz: number;
    readonly minPerMultipleChoiceQuiz: number;
  };

  readonly audio: {
    readonly cacheFolderName: string;
  };

  readonly sync: {
    readonly transactionChunkSize: number;
    readonly delayBetweenChunks: number;
  };
}
