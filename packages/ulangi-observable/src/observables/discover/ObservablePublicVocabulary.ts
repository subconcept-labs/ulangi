/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  LinkGenerator,
  SourceFormatter,
  VocabularyExtraFieldParser,
} from '@ulangi/ulangi-common/core';
import { VocabularyExtraFields } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import { IObservableArray, computed, observable } from 'mobx';

import { ObservablePublicDefinition } from './ObservablePublicDefinition';

export class ObservablePublicVocabulary {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();
  private sourceFormatter = new SourceFormatter();
  private linkGenerator = new LinkGenerator();

  @observable
  public publicVocabularyId: string;

  @observable
  public vocabularyText: string;

  @observable
  public definitions: IObservableArray<ObservablePublicDefinition>;

  @observable
  public categories: IObservableArray<string>;

  @computed
  public get vocabularyTerm(): string {
    return this.vocabularyExtraFieldParser.parse(this.vocabularyText)
      .vocabularyTerm;
  }

  @computed
  public get extraFields(): VocabularyExtraFields {
    return this.vocabularyExtraFieldParser.parse(this.vocabularyText)
      .extraFields;
  }

  @computed
  public get formattedSourcesAndLinks(): {
    formattedSource: string;
    link?: string;
  }[] {
    return this.sources.map(
      (source): { formattedSource: string; link?: string } => {
        return {
          formattedSource: this.sourceFormatter.format(source),
          link: this.linkGenerator.generateLinkBySourceAndValue(
            source,
            this.vocabularyTerm
          ),
        };
      }
    );
  }

  @computed
  public get sources(): string[] {
    return _.uniq(
      this.definitions.map(
        (definition): string => {
          return definition.source;
        }
      )
    );
  }

  public constructor(
    publicVocabularyId: string,
    vocabularyText: string,
    definitions: IObservableArray<ObservablePublicDefinition>,
    categories: IObservableArray<string>
  ) {
    this.publicVocabularyId = publicVocabularyId;
    this.vocabularyText = vocabularyText;
    this.definitions = definitions;
    this.categories = categories;
  }
}
