/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableMap, observable } from 'mobx';

import { ObservableStore } from './ObservableStore';

export class ObservableAudioStore extends ObservableStore {
  @observable
  public synthesizedSpeechMap: ObservableMap<string, string>;

  public constructor(synthesizedSpeechMap: ObservableMap<string, string>) {
    super();
    this.synthesizedSpeechMap = synthesizedSpeechMap;
  }
}
