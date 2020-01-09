/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';

export class SpeakDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public synthesize(
    text: string,
    languageCode: string,
    callback: {
      onSynthesizing: () => void;
      onSynthesizeSucceeded: (filePath: string) => void;
      onSynthesizeFailed: (errorCode: string) => void;
    },
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.AUDIO__SYNTHESIZE_SPEECH, {
        text,
        languageCode,
      }),

      group(
        on(ActionType.AUDIO__SYNTHESIZING_SPEECH, callback.onSynthesizing),
        once(
          ActionType.AUDIO__SYNTHESIZE_SPEECH_SUCCEEDED,
          ({ filePath }): void => callback.onSynthesizeSucceeded(filePath),
        ),
        once(
          ActionType.AUDIO__SYNTHESIZE_SPEECH_FAILED,
          ({ errorCode }): void => callback.onSynthesizeFailed(errorCode),
        ),
      ),
    );
  }

  public speak(
    filePath: string,
    callback: {
      onSpeaking: () => void;
      onSpeakSucceeded: () => void;
      onSpeakFailed: (errorCode: string) => void;
    },
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.AUDIO__PLAY, {
        filePath,
      }),

      group(
        on(ActionType.AUDIO__PLAYING, callback.onSpeaking),
        once(
          ActionType.AUDIO__PLAY_SUCCEEDED,
          (): void => callback.onSpeakSucceeded(),
        ),
        once(
          ActionType.AUDIO__PLAY_FAILED,
          ({ errorCode }): void => callback.onSpeakFailed(errorCode),
        ),
      ),
    );
  }
}
