/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
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
      onSynthesizeFailed: (errorBag: ErrorBag) => void;
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
          (errorBag): void => callback.onSynthesizeFailed(errorBag),
        ),
      ),
    );
  }

  public speak(
    filePath: string,
    callback: {
      onSpeaking: () => void;
      onSpeakSucceeded: () => void;
      onSpeakFailed: (errorBag: ErrorBag) => void;
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
          (errorBag): void => callback.onSpeakFailed(errorBag),
        ),
      ),
    );
  }
}
