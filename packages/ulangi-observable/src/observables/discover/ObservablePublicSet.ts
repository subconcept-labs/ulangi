/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AttributionHelper } from '@ulangi/ulangi-common/core';
import { Attribution } from '@ulangi/ulangi-common/interfaces';
import { IObservableArray, computed, observable } from 'mobx';

import { ObservablePublicVocabulary } from './ObservablePublicVocabulary';

export class ObservablePublicSet {
  private attributionHelper = new AttributionHelper();

  @observable
  public publicSetId: string;

  @observable
  public title: string;

  @observable
  public subtitle?: string;

  @observable
  public difficulty: string;

  @observable
  public tags: IObservableArray<string>;

  @observable
  public vocabularyList: IObservableArray<ObservablePublicVocabulary>;

  @observable
  public authors: IObservableArray<{
    name: string;
    link?: string;
  }>;

  @observable
  public isCurated?: boolean;

  @computed
  public get attributions(): Attribution[] {
    return this.authors.map(
      ({ name, link }): Attribution => {
        const sourceName = this.attributionHelper.formatSource(name);
        const sourceLink = link;
        const license = this.attributionHelper.getLicenseBySource(name);
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

  public constructor(
    publicSetId: string,
    title: string,
    subtitle: undefined | string,
    difficulty: string,
    tags: IObservableArray<string>,
    vocabularyList: IObservableArray<ObservablePublicVocabulary>,
    authors: IObservableArray<{
      name: string;
      link?: string;
    }>,
    isCurated: undefined | boolean
  ) {
    this.publicSetId = publicSetId;
    this.title = title;
    this.subtitle = subtitle;
    this.difficulty = difficulty;
    this.tags = tags;
    this.vocabularyList = vocabularyList;
    this.authors = authors;
    this.isCurated = isCurated;
  }
}
