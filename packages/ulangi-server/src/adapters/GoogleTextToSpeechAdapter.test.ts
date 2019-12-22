/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { loadConfig } from '../../src/setup/loadConfig';
import { resolveEnv } from '../../src/setup/resolveEnv';
import { GoogleTextToSpeechAdapter } from './GoogleTextToSpeechAdapter';

describe('GoogleTextToSpeechAdapterTest', (): void => {
  const config = loadConfig();
  const env = resolveEnv();

  let googleTextToSpeechAdapter: GoogleTextToSpeechAdapter;
  beforeEach(
    (): void => {
      googleTextToSpeechAdapter = new GoogleTextToSpeechAdapter(
        env.GOOGLE_CLOUD_PROJECT_ID,
        env.GOOGLE_CLOUD_SERVICE_ACCOUNT
      );
    }
  );

  it(`should synthesizes speech by voiceName successfully`, async (): Promise<
    void
  > => {
    const data = await googleTextToSpeechAdapter.synthesizeSpeechByLanguageCodeAndVoiceName(
      'test',
      config.googleTextToSpeech.defaultVoices['ja'].languageCode,
      config.googleTextToSpeech.defaultVoices['ja'].voiceName
    );
    expect(data[0].audioContent).toBeDefined();
  });
});
