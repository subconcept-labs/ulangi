/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

import { ObservableDefinition } from '../vocabulary/ObservableDefinition';
import { ObservableVocabulary } from '../vocabulary/ObservableVocabulary';

export class ObservableWritingQuestion {
  @observable
  public questionId: string;

  @observable
  public testingVocabulary: ObservableVocabulary;

  @observable
  public givenDefinitions: ObservableDefinition[];

  public constructor(
    questionId: string,
    testingVocabulary: ObservableVocabulary,
    givenDefinitions: ObservableDefinition[]
  ) {
    this.questionId = questionId;
    this.testingVocabulary = testingVocabulary;
    this.givenDefinitions = givenDefinitions;
  }
}
