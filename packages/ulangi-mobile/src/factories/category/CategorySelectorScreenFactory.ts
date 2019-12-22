/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableCategorySelectorScreen } from '@ulangi/ulangi-observable';

import { CategoryFormDelegate } from '../../delegates/category/CategoryFormDelegate';
import { CategorySelectorScreenDelegate } from '../../delegates/category/CategorySelectorScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class CategorySelectorScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableCategorySelectorScreen
  ): CategorySelectorScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const categoryFormDelegate = new CategoryFormDelegate(
      this.eventBus,
      this.observer,
      this.props.rootStore.setStore,
      observableScreen.categoryFormState
    );

    return new CategorySelectorScreenDelegate(
      this.eventBus,
      observableScreen,
      categoryFormDelegate,
      dialogDelegate,
      navigatorDelegate
    );
  }
}
