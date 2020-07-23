/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenState } from '@ulangi/ulangi-common/enums';
import {
  ObservableCategorySelectorScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { CategoryFormDelegate } from './CategoryFormDelegate';

@boundClass
export class CategorySelectorScreenDelegate {
  private observer: Observer;
  private observableScreen: ObservableCategorySelectorScreen;
  private categoryFormDelegate: CategoryFormDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private onSelect: (categoryName: string) => void;

  public constructor(
    observer: Observer,
    observableScreen: ObservableCategorySelectorScreen,
    categoryFormDelegate: CategoryFormDelegate,
    navigatorDelegate: NavigatorDelegate,
    onSelect: (categoryName: string) => void,
  ) {
    this.observer = observer;
    this.observableScreen = observableScreen;
    this.categoryFormDelegate = categoryFormDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.onSelect = onSelect;
  }

  public handleInputChange(searchInput: string): void {
    this.observableScreen.categoryFormState.searchInput = searchInput;
  }

  public selectCategory(categoryName: string): void {
    this.navigatorDelegate.pop();
    this.observer.when(
      (): boolean =>
        this.observableScreen.screenState === ScreenState.UNMOUNTED,
      (): void => {
        this.onSelect(categoryName);
      },
    );
  }

  public prepareAndFetchCategorySuggestions(): void {
    this.categoryFormDelegate.prepareAndFetchSuggestions(
      this.observableScreen.categoryFormState.searchInput,
    );
  }

  public fetchCategorySuggestions(): void {
    this.categoryFormDelegate.fetchSuggestions();
  }

  public clearFetchCategorySuggestions(): void {
    this.categoryFormDelegate.clearFetchSuggestions();
  }

  public clear(): void {
    this.categoryFormDelegate.clear();
  }

  public autoRefreshCategorySuggestionsOnInputChange(
    debounceTime: number,
  ): void {
    this.categoryFormDelegate.autoRefreshCategorySuggestionsOnInputChange(
      debounceTime,
    );
  }
}
