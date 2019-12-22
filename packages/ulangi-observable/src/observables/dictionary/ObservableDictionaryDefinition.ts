/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { WordClass } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

export class ObservableDictionaryDefinition {
  @observable
  public wordClasses: readonly WordClass[];

  @observable
  public meaning: string;

  @observable
  public source: string;

  public constructor(
    wordClasses: readonly WordClass[],
    meaning: string,
    source: string
  ) {
    this.wordClasses = wordClasses;
    this.meaning = meaning;
    this.source = source;
  }
}
