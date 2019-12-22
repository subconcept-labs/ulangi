/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyCategory } from '@ulangi/ulangi-common/interfaces';
import { observable, toJS } from 'mobx';

export class ObservableVocabularyCategory {
  @observable
  public categoryName: string;

  @observable
  public createdAt: Date;

  @observable
  public updatedAt: Date;

  @observable
  public firstSyncedAt: null | Date;

  @observable
  public lastSyncedAt: null | Date;

  public toRaw(): VocabularyCategory {
    return {
      categoryName: this.categoryName,
      createdAt: toJS(this.createdAt),
      updatedAt: toJS(this.updatedAt),
      firstSyncedAt: toJS(this.firstSyncedAt),
      lastSyncedAt: toJS(this.lastSyncedAt),
    };
  }

  public constructor(
    categoryName: string,
    createdAt: Date,
    updatedAt: Date,
    firstSyncedAt: null | Date,
    lastSyncedAt: null | Date
  ) {
    this.categoryName = categoryName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.firstSyncedAt = firstSyncedAt;
    this.lastSyncedAt = lastSyncedAt;
  }
}
