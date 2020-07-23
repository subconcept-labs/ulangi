/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AttributionHelper } from '@ulangi/ulangi-common/core';
import { Attribution } from '@ulangi/ulangi-common/interfaces';
import { computed, observable } from 'mobx';

import { ObservableDictionaryDefinition } from './ObservableDictionaryDefinition';

export class ObservableDictionaryEntry {
  private attributionHelper = new AttributionHelper();

  @observable
  public vocabularyTerm: string;

  @observable
  public definitions: readonly ObservableDictionaryDefinition[];

  @observable
  public categories: string[];

  @observable
  public tags: string[];

  @observable
  public ipa?: string[];

  @observable
  public gender?: string[];

  @observable
  public plural?: string[];

  @observable
  public pinyin?: string[];

  @observable
  public zhuyin?: string[];

  @observable
  public simplified?: string[];

  @observable
  public traditional?: string[];

  @observable
  public hiragana?: string[];

  @observable
  public reading?: string[];

  @observable
  public romaji?: string[];

  @observable
  public romanization?: string[];

  @observable
  public feminine?: string[];

  @observable
  public masculine?: string[];

  @observable
  public sources?: string[];

  @computed
  public get attributions(): undefined | Attribution[] {
    return typeof this.sources !== 'undefined'
      ? this.sources.map(
          (source): Attribution => {
            const sourceName = this.attributionHelper.formatSource(source);
            const sourceLink = this.attributionHelper.generateLinkBySource(
              source,
              {
                term: this.vocabularyTerm,
              }
            );
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
        )
      : undefined;
  }

  public constructor(
    vocabularyTerm: string,
    definitions: readonly ObservableDictionaryDefinition[],
    categories: string[],
    tags: string[],
    ipa?: string[],
    gender?: string[],
    plural?: string[],
    pinyin?: string[],
    zhuyin?: string[],
    simplified?: string[],
    traditional?: string[],
    hiragana?: string[],
    reading?: string[],
    romaji?: string[],
    romanization?: string[],
    feminine?: string[],
    masculine?: string[],
    sources?: string[]
  ) {
    this.vocabularyTerm = vocabularyTerm;
    this.definitions = definitions;
    this.categories = categories;
    this.tags = tags;
    this.ipa = ipa;
    this.gender = gender;
    this.plural = plural;
    this.pinyin = pinyin;
    this.zhuyin = zhuyin;
    this.simplified = simplified;
    this.traditional = traditional;
    this.hiragana = hiragana;
    this.reading = reading;
    this.romaji = romaji;
    this.romanization = romanization;
    this.feminine = feminine;
    this.masculine = masculine;
    this.sources = sources;
  }
}
