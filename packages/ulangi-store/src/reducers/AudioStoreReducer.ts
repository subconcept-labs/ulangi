/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, InferableAction } from '@ulangi/ulangi-action';
import { ObservableAudioStore } from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class AudioStoreReducer extends Reducer {
  private audioStore: ObservableAudioStore;

  public constructor(audioStore: ObservableAudioStore) {
    super();
    this.audioStore = audioStore;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.AUDIO__SYNTHESIZE_SPEECH_SUCCEEDED)) {
      this.synthesizeSpeechSucceeded(action);
    }
  }

  private synthesizeSpeechSucceeded(
    action: Action<ActionType.AUDIO__SYNTHESIZE_SPEECH_SUCCEEDED>
  ): void {
    const { text, filePath } = action.payload;
    this.audioStore.synthesizedSpeechMap = this.audioStore.synthesizedSpeechMap.set(
      text,
      filePath
    );
  }
}
