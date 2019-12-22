/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ErrorCode } from '@ulangi/ulangi-common/enums';
import * as AWS from 'aws-sdk';

export class PollyAdapter {
  private voiceList!: AWS.Polly.VoiceList;

  private polly: AWS.Polly;

  public constructor(polly: AWS.Polly) {
    this.polly = polly;
  }

  public prefetchAllVoiceList(): Promise<void> {
    return new Promise<void>(
      async (resolve, reject): Promise<void> => {
        try {
          this.voiceList = await this.fetchAllVoiceList();
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public hasVoiceByLanguageCode(languageCode: string): boolean {
    return this.getVoiceIdByLanguageCode(languageCode) !== null;
  }

  public synthesizeSpeechByLanguageCode(
    text: string,
    languageCode: string
  ): Promise<AWS.Polly.SynthesizeSpeechOutput> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const voiceId = this.getVoiceIdByLanguageCode(languageCode);
          if (voiceId !== null) {
            const result = await this.synthesizeSpeechByVoiceId(text, voiceId);
            resolve(result);
          } else {
            reject(
              ErrorCode.VOCABULARY__LANGUAGE_NOT_SUPPORTED_FOR_SYNTHESIZE_SPEECH
            );
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public synthesizeSpeechByVoiceId(
    text: string,
    voiceId: string
  ): Promise<AWS.Polly.Types.SynthesizeSpeechOutput> {
    return this.polly
      .synthesizeSpeech({
        Text: text,
        TextType: 'text',
        VoiceId: voiceId,
        OutputFormat: 'mp3',
      })
      .promise();
  }

  public getVoiceIdByLanguageCode(languageCode: string): null | string {
    const found = this.voiceList.find(
      (voice): boolean => {
        return typeof voice.LanguageCode === languageCode;
      }
    );

    const voiceId =
      typeof found !== 'undefined' && typeof found.Id !== 'undefined'
        ? found.Id
        : null;
    return voiceId;
  }

  private fetchAllVoiceList(): Promise<AWS.Polly.VoiceList> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        const voiceList: AWS.Polly.VoiceList = [];
        let nextToken;
        try {
          do {
            const data: AWS.Polly.DescribeVoicesOutput = await this.fetchNextVoiceList(
              nextToken
            );
            voiceList.push(...assertExists(data.Voices));
            nextToken = data.NextToken;
          } while (nextToken);
        } catch (error) {
          console.log(error);
          reject(error);
        }

        resolve(voiceList);
      }
    );
  }

  private fetchNextVoiceList(
    nextToken?: string
  ): Promise<AWS.Polly.DescribeVoicesOutput> {
    return new Promise(
      (resolve, reject): void => {
        const params = {
          NextToken: nextToken,
        };
        this.polly.describeVoices(params, function(error, data): void {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      }
    );
  }
}
