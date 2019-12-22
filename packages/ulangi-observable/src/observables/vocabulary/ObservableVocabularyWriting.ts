/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyWriting } from '@ulangi/ulangi-common/interfaces';
import { computed, observable, toJS } from 'mobx';
import * as moment from 'moment';

export class ObservableVocabularyWriting {
  @observable
  public level: number;

  @observable
  public lastWrittenAt: null | Date;

  @observable
  public disabled: boolean;

  @observable
  public createdAt: Date;

  @observable
  public updatedAt: Date;

  @observable
  public firstSyncedAt: null | Date;

  @observable
  public lastSyncedAt: null | Date;

  @computed
  public get hasBeenWrittenBefore(): boolean {
    return this.lastWrittenAt !== null;
  }

  @computed
  public get lastWrittenFromNow(): string {
    return this.lastWrittenAt === null
      ? 'N/A'
      : moment(this.lastWrittenAt).fromNow();
  }

  public toRaw(): VocabularyWriting {
    return {
      level: this.level,
      lastWrittenAt: toJS(this.lastWrittenAt),
      disabled: this.disabled,
      createdAt: toJS(this.createdAt),
      updatedAt: toJS(this.updatedAt),
      firstSyncedAt: toJS(this.firstSyncedAt),
      lastSyncedAt: toJS(this.lastSyncedAt),
    };
  }

  public constructor(
    level: number,
    lastWrittenAt: null | Date,
    disabled: boolean,
    createdAt: Date,
    updatedAt: Date,
    firstSyncedAt: null | Date,
    lastSyncedAt: null | Date
  ) {
    this.level = level;
    this.lastWrittenAt = lastWrittenAt;
    this.disabled = disabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.firstSyncedAt = firstSyncedAt;
    this.lastSyncedAt = lastSyncedAt;
  }
}
