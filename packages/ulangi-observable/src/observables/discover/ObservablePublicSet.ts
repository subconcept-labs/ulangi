/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SourceFormatter } from '@ulangi/ulangi-common/core';
import { IObservableArray, computed, observable } from 'mobx';

import { ObservablePublicVocabulary } from './ObservablePublicVocabulary';

export class ObservablePublicSet {
  private sourceFormatter = new SourceFormatter();

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
  public get formattedAuthors(): {
    formattedName: string;
    link?: string;
  }[] {
    return this.authors.map(
      ({
        name,
        link,
      }): {
        formattedName: string;
        link?: string;
      } => {
        return {
          formattedName: this.sourceFormatter.format(name),
          link,
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
