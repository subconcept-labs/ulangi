/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefinitionExtraFieldParser } from '@ulangi/ulangi-common/core';
import { DefinitionStatus, WordClass } from '@ulangi/ulangi-common/enums';
import {
  Definition,
  DefinitionExtraFields,
} from '@ulangi/ulangi-common/interfaces';
import { computed, observable, toJS } from 'mobx';

export class ObservableDefinition {
  private definitionExtraFieldParser = new DefinitionExtraFieldParser();

  @observable
  public definitionId: string;

  @observable
  public definitionStatus: DefinitionStatus;

  @observable
  public meaning: string;

  @observable
  public wordClasses: readonly WordClass[];

  @observable
  public source: string;

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
  public extraData: readonly any[];

  @computed
  public get plainMeaning(): string {
    return this.definitionExtraFieldParser.parse(this.meaning).plainMeaning;
  }

  @computed
  public get extraFields(): DefinitionExtraFields {
    return this.definitionExtraFieldParser.parse(this.meaning).extraFields;
  }

  public toRaw(): Definition {
    return {
      definitionId: this.definitionId,
      definitionStatus: this.definitionStatus,
      meaning: this.meaning,
      wordClasses: toJS(this.wordClasses),
      source: this.source,
      createdAt: toJS(this.createdAt),
      updatedAt: toJS(this.updatedAt),
      updatedStatusAt: toJS(this.updatedStatusAt),
      firstSyncedAt: toJS(this.firstSyncedAt),
      lastSyncedAt: toJS(this.lastSyncedAt),
      extraData: toJS(this.extraData),
    };
  }

  public constructor(
    definitionId: string,
    definitionStatus: DefinitionStatus,
    meaning: string,
    wordClasses: readonly WordClass[],
    source: string,
    createdAt: Date,
    updatedAt: Date,
    updatedStatusAt: Date,
    firstSyncedAt: null | Date,
    lastSyncedAt: null | Date,
    extraData: readonly any[]
  ) {
    this.definitionId = definitionId;
    this.definitionStatus = definitionStatus;
    this.meaning = meaning;
    this.wordClasses = wordClasses;
    this.source = source;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedStatusAt = updatedStatusAt;
    this.firstSyncedAt = firstSyncedAt;
    this.lastSyncedAt = lastSyncedAt;
    this.extraData = extraData;
  }
}
