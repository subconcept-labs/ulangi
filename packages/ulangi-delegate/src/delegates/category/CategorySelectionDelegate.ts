/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ObservableCategory } from '@ulangi/ulangi-observable';
import { IObservableValue, ObservableMap, runInAction } from 'mobx';

interface ObservableScreen {
  categoryList: null | ObservableMap<string, ObservableCategory>;
  isSelectionModeOn: IObservableValue<boolean>;
}

export class CategorySelectionDelegate {
  private observableScreen: ObservableScreen;

  public constructor(observableScreen: ObservableScreen) {
    this.observableScreen = observableScreen;
  }

  public setSelection(categoryName: string, selection: boolean): void {
    if (this.observableScreen.categoryList !== null) {
      if (this.observableScreen.categoryList.has(categoryName)) {
        const category = assertExists(
          this.observableScreen.categoryList.get(categoryName)
        );

        category.isSelected.set(selection);
      }

      this.observableScreen.isSelectionModeOn.set(true);
    }
  }

  public clearSelections(): void {
    this.observableScreen.isSelectionModeOn.set(false);

    runInAction(
      (): void => {
        if (this.observableScreen.categoryList !== null) {
          return Array.from(
            this.observableScreen.categoryList.values()
          ).forEach(
            (category): void => {
              category.isSelected.set(false);
            }
          );
        }
      }
    );
  }

  public selectAll(): void {
    this.observableScreen.isSelectionModeOn.set(true);

    runInAction(
      (): void => {
        if (this.observableScreen.categoryList !== null) {
          return Array.from(
            this.observableScreen.categoryList.values()
          ).forEach(
            (category): void => {
              category.isSelected.set(true);
            }
          );
        }
      }
    );
  }
}
