/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  AttributionHelper,
  VocabularyExtraFieldParser,
} from '@ulangi/ulangi-common/core';
import {
  Attribution,
  VocabularyExtraFields,
} from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import { IObservableArray, computed, observable } from 'mobx';

import { ObservablePublicDefinition } from './ObservablePublicDefinition';

export class ObservablePublicVocabulary {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();
  private attributionHelper = new AttributionHelper();

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
  public get attributions(): Attribution[] {
    return this.sources.map(
      (source): Attribution => {
        const sourceName = this.attributionHelper.formatSource(source);
        const sourceLink = this.attributionHelper.generateLinkBySource(source, {
          term: this.vocabularyTerm,
        });
        const license = this.attributionHelper.getLicenseBySource(source);
        const licenseLink = this.attributionHelper.getLinkByLicense(
          license || ''
        );

        return {
          sourceName,
          sourceLink,
          license,
          licenseLink,
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
