/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableFlashcardPlayerScreen } from '@ulangi/ulangi-observable';

import { CategoryMessageDelegate } from '../../delegates/category/CategoryMessageDelegate';
import { FlashcardPlayerScreenDelegate } from '../../delegates/flashcard-player/FlashcardPlayerScreenDelegate';
import { FlashcardPlayerStyle } from '../../styles/FlashcardPlayerStyle';
import { ScreenFactory } from '../ScreenFactory';

export class FlashcardPlayerScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableFlashcardPlayerScreen,
  ): FlashcardPlayerScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      FlashcardPlayerStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const categoryMessageDelegate = new CategoryMessageDelegate(dialogDelegate);

    return new FlashcardPlayerScreenDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      observableScreen,
      dialogDelegate,
      navigatorDelegate,
      categoryMessageDelegate,
    );
  }
}
