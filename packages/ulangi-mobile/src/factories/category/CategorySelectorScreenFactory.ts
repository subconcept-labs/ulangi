/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableCategorySelectorScreen } from '@ulangi/ulangi-observable';

import { CategoryFormDelegate } from '../../delegates/category/CategoryFormDelegate';
import { CategorySelectorScreenDelegate } from '../../delegates/category/CategorySelectorScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class CategorySelectorScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableCategorySelectorScreen,
    onSelect: (categoryName: string) => void,
  ): CategorySelectorScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const categoryFormDelegate = new CategoryFormDelegate(
      this.eventBus,
      this.observer,
      this.props.rootStore.setStore,
      observableScreen.categoryFormState,
    );

    return new CategorySelectorScreenDelegate(
      this.observer,
      observableScreen,
      categoryFormDelegate,
      navigatorDelegate,
      onSelect,
    );
  }
}
