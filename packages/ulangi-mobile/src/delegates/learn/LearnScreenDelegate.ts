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
export class LearnScreenDelegate {
  private navigatorDelegate: NavigatorDelegate;

  public constructor(navigatorDelegate: NavigatorDelegate) {
    this.navigatorDelegate = navigatorDelegate;
  }

  public navigateToWhatToUseScreen(): void {
    this.navigatorDelegate.push(ScreenName.WHAT_TO_USE_SCREEN, {});
  }

  public navigateToSpacedRepetitionScreen(): void {
    this.navigatorDelegate.push(ScreenName.SPACED_REPETITION_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }

  public navigateToWritingScreen(): void {
    this.navigatorDelegate.push(ScreenName.WRITING_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }

  public navigateToQuizScreen(): void {
    this.navigatorDelegate.push(ScreenName.QUIZ_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }
}
