/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface Config {
  readonly user: {
    readonly passwordMinLength: number;
    readonly passwordEncryptionSaltRounds: number;
    readonly resetPasswordRequestExpirationHours: number;
  };

  readonly library: {
    readonly fetchPublicSetMaxOffset: number;
    readonly fetchPublicVocabularyMaxOffset: number;
  };

  readonly pixabay: {
    readonly apiUrl: string;
    readonly developerKey: string;
    readonly bucketName: string;
    readonly folderName: string;
    readonly imageUrl: string;
  };

  readonly languageMap: { [P in string]: string };

  readonly googleTextToSpeech: {
    readonly defaultVoices: {
      [P in string]: {
        voiceName: string;
        languageCode: string;
      }
    };
  };

  readonly polly: {
    readonly defaultVoices: {
      [P in string]: {
        voiceId: string;
        languageCode: string;
      }
    };
  };
}
