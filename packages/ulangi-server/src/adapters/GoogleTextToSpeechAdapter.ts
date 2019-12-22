/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import TextToSpeech, {
  SynthesizeSpeechResponse,
} from '@google-cloud/text-to-speech';

export class GoogleTextToSpeechAdapter {
  private textToSpeechClient: InstanceType<
    typeof TextToSpeech.TextToSpeechClient
  >;

  public constructor(
    googleCloudProjectId: string,
    googleCloudServiceAccount: string
  ) {
    this.textToSpeechClient = new TextToSpeech.TextToSpeechClient({
      projectId: googleCloudProjectId,
      keyFilename: googleCloudServiceAccount,
    });
  }

  public synthesizeSpeechByLanguageCodeAndVoiceName(
    text: string,
    languageCode: string,
    voiceName: string
  ): Promise<[SynthesizeSpeechResponse]> {
    return this.textToSpeechClient.synthesizeSpeech({
      input: {
        text,
      },
      voice: {
        languageCode,
        name: voiceName,
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    });
  }
}
