/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AttributionHelper } from '@ulangi/ulangi-common/core';
import { Attribution } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import { computed, observable } from 'mobx';

import { ObservableDictionaryDefinition } from './ObservableDictionaryDefinition';

export class ObservableDictionaryEntry {
  private attributionHelper = new AttributionHelper();

  @observable
  public vocabularyText: string;

  @observable
  public definitions: readonly ObservableDictionaryDefinition[];

  @computed
  public get definitionsBySource(): {
    attribution: Attribution;
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
        attribution: Attribution;
        definitions: readonly ObservableDictionaryDefinition[];
      } => {
        const sourceName = this.attributionHelper.formatSource(source);
        const sourceLink = this.attributionHelper.generateLinkBySource(source, {
          term: this.vocabularyText,
        });
        const license = this.attributionHelper.getLicenseBySource(source);
        const licenseLink = this.attributionHelper.getLinkByLicense(
          license || ''
        );

        return {
          attribution: {
            sourceName,
            sourceLink,
            license,
            licenseLink,
          },
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
