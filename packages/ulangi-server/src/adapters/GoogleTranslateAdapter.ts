/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  DetectResult,
  Translate as GoogleTranslate,
} from '@google-cloud/translate';
import { Translation } from '@ulangi/ulangi-common/interfaces';
import * as changeCase from 'change-case';

export class GoogleTranslateAdapter {
  private googleTranslate: GoogleTranslate;

  public constructor(
    googleCloudProjectId: string,
    googleCloudServiceAccount: string
  ) {
    this.googleTranslate = new GoogleTranslate({
      projectId: googleCloudProjectId,
      keyFilename: googleCloudServiceAccount,
    });
  }

  public checkTranslators(): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          await this.translate('test', 'en', 'vi');
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public detectLanguages(sourceText: string): Promise<readonly string[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const [results] = await this.googleTranslate.detect(sourceText);
          const detections: DetectResult[] = Array.isArray(results)
            ? results
            : [results];

          const languages = detections.map(
            (result): string => {
              return result.language;
            }
          );

          resolve(languages);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public translate(
    sourceText: string,
    sourceLanguageCode: string,
    translatedToLanguageCode: string
  ): Promise<Translation[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const [results] = await this.googleTranslate.translate(sourceText, {
            from: sourceLanguageCode,
            to: translatedToLanguageCode,
          });
          const translatedTexts: string[] = Array.isArray(results)
            ? results
            : [results];

          const translations = translatedTexts
            .map(
              (translatedText): Translation => {
                return {
                  sourceText,
                  translatedText,
                  translatedBy: 'google',
                };
              }
            )
            // Remove translations that have the same sourceText and translatedText
            .filter(
              (translation): boolean => {
                return (
                  translation.sourceText.toLowerCase() !==
                    translation.translatedText.toLowerCase() ||
                  changeCase.lower(
                    translation.sourceText,
                    sourceLanguageCode
                  ) !==
                    changeCase.lower(
                      translation.translatedText,
                      translatedToLanguageCode
                    )
                );
              }
            );
          resolve(translations);
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
