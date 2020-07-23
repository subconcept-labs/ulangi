/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableCategorizeScreen } from '@ulangi/ulangi-observable';

import { CategorizeScreenDelegate } from '../../delegates/category/CategorizeScreenDelegate';
import { CategoryFormDelegate } from '../../delegates/category/CategoryFormDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class CategorizeScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableCategorizeScreen,
    selectedVocabularyIds: readonly string[],
  ): CategorizeScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const categoryFormDelegate = new CategoryFormDelegate(
      this.eventBus,
      this.observer,
      this.props.rootStore.setStore,
      observableScreen.categoryFormState,
    );

    return new CategorizeScreenDelegate(
      this.eventBus,
      observableScreen,
      categoryFormDelegate,
      dialogDelegate,
      navigatorDelegate,
      selectedVocabularyIds,
    );
  }
}
