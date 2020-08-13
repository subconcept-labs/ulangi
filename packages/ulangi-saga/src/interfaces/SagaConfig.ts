/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface SagaConfig {
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
    readonly fetchLimit: number;
  };

  readonly reflex: {
    readonly fetchLimit: number;
  };

  readonly quiz: {
    readonly writing: {
      readonly minPerQuiz: number;
    };
    readonly multipleChoice: {
      readonly minPerQuiz: number;
    };
  };

  readonly audio: {
    readonly cacheFolderName: string;
  };

  readonly sync: {
    readonly delayBetweenTransactions: number;
  };
}
