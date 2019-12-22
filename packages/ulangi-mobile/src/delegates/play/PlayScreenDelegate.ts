/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class PlayScreenDelegate {
  private navigatorDelegate: NavigatorDelegate;

  public constructor(navigatorDelegate: NavigatorDelegate) {
    this.navigatorDelegate = navigatorDelegate;
  }

  public navigateToWhatToUseScreen(): void {
    this.navigatorDelegate.push(ScreenName.WHAT_TO_USE_SCREEN, {});
  }

  public navigateToAtomScreen(): void {
    this.navigatorDelegate.push(ScreenName.ATOM_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }

  public navigateToReflexScreen(): void {
    this.navigatorDelegate.push(ScreenName.REFLEX_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }

  public navigateToFlashcardPlayerScreen(): void {
    this.navigatorDelegate.push(ScreenName.FLASHCARD_PLAYER_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }
}
