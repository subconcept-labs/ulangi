/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as AWS from 'aws-sdk';

import { loadConfig } from '../../src/setup/loadConfig';
import { resolveEnv } from '../../src/setup/resolveEnv';
import { setupAWS } from '../../src/setup/setupAWS';
import { PollyAdapter } from './PollyAdapter';

describe('PollyAdapterTest', (): void => {
  const config = loadConfig();
  const env = resolveEnv();

  setupAWS(
    env.AWS_ACCESS_KEY_ID,
    env.AWS_SECRET_ACCESS_KEY,
    env.AWS_DEFAULT_REGION
  );

  let pollyAdapter: PollyAdapter;
  beforeEach(
    (): void => {
      pollyAdapter = new PollyAdapter(new AWS.Polly());
    }
  );

  it(`should synthesizes speech by voiceId successfully`, async (): Promise<
    void
  > => {
    const data = await pollyAdapter.synthesizeSpeechByVoiceId(
      'test',
      config.polly.defaultVoices['ja'].voiceId
    );
    expect(data.AudioStream).toBeDefined();
  });
});
