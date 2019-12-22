/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  LicenseGetter,
  LinkGenerator,
  SourceFormatter,
} from '@ulangi/ulangi-common/core';
import * as _ from 'lodash';
import { computed, observable } from 'mobx';

import { ObservableDictionaryDefinition } from './ObservableDictionaryDefinition';

export class ObservableDictionaryEntry {
  private sourceFormatter = new SourceFormatter();
  private linkGenerator = new LinkGenerator();
  private licenseGetter = new LicenseGetter();

  @observable
  public vocabularyText: string;

  @observable
  public definitions: readonly ObservableDictionaryDefinition[];

  @computed
  public get definitionsBySource(): {
    formattedSource: string;
    link?: string;
    license: string;
    definitions: readonly ObservableDictionaryDefinition[];
  }[] {
    const groupBySource = _.groupBy(
      this.definitions,
      (definition: ObservableDictionaryDefinition): string => {
        return definition.source;
      }
    );

    return _.map(
      groupBySource,
      (
        definitions,
        source
      ): {
        formattedSource: string;
        link?: string;
        license: string;
        definitions: readonly ObservableDictionaryDefinition[];
      } => {
        return {
          formattedSource: this.sourceFormatter.format(source),
          link: this.linkGenerator.generateLinkBySourceAndValue(
            source,
            this.vocabularyText
          ),
          license: this.licenseGetter.getLicenseBySource(source),
          definitions,
        };
      }
    );
  }

  public constructor(
    vocabularyText: string,
    definitions: readonly ObservableDictionaryDefinition[]
  ) {
    this.vocabularyText = vocabularyText;
    this.definitions = definitions;
  }
}
