/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableAutoArchiveSettings {
  @observable
  public autoArchiveEnabled: boolean;

  @observable
  public spacedRepetitionLevelThreshold: number;

  @observable
  public writingLevelThreshold: number;

  public constructor(
    autoArchiveEnabled: boolean,
    spacedRepetitionLevelThreshold: number,
    writingLevelThreshold: number
  ) {
    this.autoArchiveEnabled = autoArchiveEnabled;
    this.spacedRepetitionLevelThreshold = spacedRepetitionLevelThreshold;
    this.writingLevelThreshold = writingLevelThreshold;
  }
}
