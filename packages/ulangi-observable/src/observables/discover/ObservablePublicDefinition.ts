/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefinitionExtraFieldParser } from '@ulangi/ulangi-common/core';
import { WordClass } from '@ulangi/ulangi-common/enums';
import { DefinitionExtraFields } from '@ulangi/ulangi-common/interfaces';
import { computed, observable } from 'mobx';

export class ObservablePublicDefinition {
  private definitionExtraFieldParser = new DefinitionExtraFieldParser();

  @observable
  public meaning: string;

  @observable
  public wordClasses: readonly WordClass[];

  @observable
  public source: string;

  @computed
  public get plainMeaning(): string {
    return this.definitionExtraFieldParser.parse(this.meaning).plainMeaning;
  }

  @computed
  public get extraFields(): DefinitionExtraFields {
    return this.definitionExtraFieldParser.parse(this.meaning).extraFields;
  }

  public constructor(
    meaning: string,
    wordClasses: readonly WordClass[],
    source: string
  ) {
    this.meaning = meaning;
    this.wordClasses = wordClasses;
    this.source = source;
  }
}
