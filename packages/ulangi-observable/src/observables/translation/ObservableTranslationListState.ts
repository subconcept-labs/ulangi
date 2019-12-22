/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState } from '@ulangi/ulangi-common/enums';
import { IObservableArray, IObservableValue, action, observable } from 'mobx';

import { ObservableTranslation } from './ObservableTranslation';
import { ObservableTranslationWithLanguages } from './ObservableTranslationWithLanguages';

export class ObservableTranslationListState {
  @observable
  public translationsWithLanguages: null | IObservableArray<
    ObservableTranslationWithLanguages
  >;

  @observable
  public translations: null | IObservableArray<ObservableTranslation>;

  public readonly translateState: IObservableValue<ActivityState>;

  public readonly translateError: IObservableValue<undefined | string>;

  public readonly isRefreshing: IObservableValue<boolean>;

  @action
  public reset(): void {
    this.translationsWithLanguages = null;
    this.translations = null;
    this.translateState.set(ActivityState.INACTIVE);
    this.translateError.set(undefined);
    this.isRefreshing.set(false);
  }

  public constructor(
    translationsWithLanguages: null | IObservableArray<
      ObservableTranslationWithLanguages
    >,
    translations: null | IObservableArray<ObservableTranslation>,
    translateState: IObservableValue<ActivityState>,
    translateError: IObservableValue<undefined | string>,
    isRefreshing: IObservableValue<boolean>
  ) {
    this.translationsWithLanguages = translationsWithLanguages;
    this.translations = translations;
    this.translateState = translateState;
    this.translateError = translateError;
    this.isRefreshing = isRefreshing;
  }
}
