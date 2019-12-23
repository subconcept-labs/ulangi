/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableAudioStore } from '@ulangi/ulangi-observable';
import * as path from 'path';

import Sound = require('react-native-sound');

export class SpeakDelegate {
  private eventBus: EventBus;
  private audioStore: ObservableAudioStore;

  public constructor(eventBus: EventBus, audioStore: ObservableAudioStore) {
    this.eventBus = eventBus;
    this.audioStore = audioStore;
  }

  public getAudioFilePath(text: string): undefined | string {
    return this.audioStore.synthesizedSpeechMap.get(text);
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
      onSpeakSucceeded: () => void;
      onSpeakFailed: () => void;
    },
  ): void {
    const fileName = path.basename(filePath);
    const baseDir = path.dirname(filePath);
    Sound.setCategory('Playback', false);

    const sound = new Sound(
      fileName,
      baseDir,
      (error: any): void => {
        if (error) {
          callback.onSpeakFailed();
          console.warn(error);
        } else {
          sound.play(
            (): void => {
              callback.onSpeakSucceeded();
            },
          );
        }
      },
    );
  }
}
