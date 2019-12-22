/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import {
  Definition,
  Vocabulary,
  VocabularyExtraFields,
} from '@ulangi/ulangi-common/interfaces';
import {
  IObservableArray,
  IObservableValue,
  computed,
  observable,
  toJS,
} from 'mobx';
import * as moment from 'moment';

import { ObservableDefinition } from './ObservableDefinition';
import { ObservableVocabularyCategory } from './ObservableVocabularyCategory';
import { ObservableVocabularyWriting } from './ObservableVocabularyWriting';

export class ObservableVocabulary {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  @observable
  public vocabularyId: string;

  @observable
  public vocabularyText: string;

  @observable
  public vocabularyStatus: VocabularyStatus;

  @observable
  public definitions: IObservableArray<ObservableDefinition>;

  @observable
  public level: number;

  @observable
  public lastLearnedAt: null | Date;

  @observable
  public createdAt: Date;

  @observable
  public updatedAt: Date;

  @observable
  public updatedStatusAt: Date;

  @observable
  public firstSyncedAt: null | Date;

  @observable
  public lastSyncedAt: null | Date;

  @observable
  public extraData: IObservableArray<any>;

  @observable
  public category?: ObservableVocabularyCategory;

  @observable
  public writing?: ObservableVocabularyWriting;

  @observable
  public isSelected: IObservableValue<boolean>;

  @computed
  public get vocabularyTerm(): string {
    return this.vocabularyExtraFieldParser.parse(this.vocabularyText)
      .vocabularyTerm;
  }

  @computed
  public get vocabularyExtraFields(): VocabularyExtraFields {
    return this.vocabularyExtraFieldParser.parse(this.vocabularyText)
      .extraFields;
  }

  @computed
  public get hasBeenReviewedBefore(): boolean {
    return this.lastLearnedAt !== null;
  }

  @computed
  public get lastLearnedFromNow(): string {
    return this.lastLearnedAt === null
      ? 'N/A'
      : moment(this.lastLearnedAt).fromNow();
  }

  public toRaw(): Vocabulary {
    return {
      vocabularyId: this.vocabularyId,
      vocabularyText: this.vocabularyText,
      vocabularyStatus: this.vocabularyStatus,
      definitions: this.definitions.map(
        (definition): Definition => definition.toRaw()
      ),
      level: this.level,
      lastLearnedAt: toJS(this.lastLearnedAt),
      createdAt: toJS(this.createdAt),
      updatedAt: toJS(this.updatedAt),
      updatedStatusAt: toJS(this.updatedStatusAt),
      firstSyncedAt: toJS(this.firstSyncedAt),
      lastSyncedAt: toJS(this.lastSyncedAt),
      extraData: toJS(this.extraData),
      category:
        typeof this.category === 'undefined'
          ? undefined
          : this.category.toRaw(),
      writing:
        typeof this.writing === 'undefined' ? undefined : this.writing.toRaw(),
    };
  }

  public constructor(
    vocabularyId: string,
    vocabularyText: string,
    vocabularyStatus: VocabularyStatus,
    definitions: ObservableDefinition[],
    level: number,
    lastLearnedAt: null | Date,
    createdAt: Date,
    updatedAt: Date,
    updatedStatusAt: Date,
    firstSyncedAt: null | Date,
    lastSyncedAt: null | Date,
    extraData: any[],
    category: undefined | ObservableVocabularyCategory,
    writing: undefined | ObservableVocabularyWriting,
    isSelected: boolean
  ) {
    this.vocabularyId = vocabularyId;
    this.vocabularyText = vocabularyText;
    this.vocabularyStatus = vocabularyStatus;
    this.definitions = observable.array(definitions);
    this.level = level;
    this.lastLearnedAt = lastLearnedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedStatusAt = updatedStatusAt;
    this.firstSyncedAt = firstSyncedAt;
    this.lastSyncedAt = lastSyncedAt;
    this.extraData = observable.array(extraData);
    this.category = category;
    this.writing = writing;
    this.isSelected = observable.box(isSelected);
  }
}
