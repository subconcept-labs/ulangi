/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { boundClass } from 'autobind-decorator';

import { RemoteLogger } from '../../RemoteLogger';
import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';

@boundClass
export class SpacedRepetitionFAQScreenDelegate {
  private navigatorDelegate: NavigatorDelegate;

  public constructor(navigatorDelegate: NavigatorDelegate) {
    this.navigatorDelegate = navigatorDelegate;
  }

  public showSpacedRepetitionWiki(): void {
    RemoteLogger.logEvent('open_srs_wiki_link');
    this.navigatorDelegate.showModal(ScreenName.BROWSER_SCREEN, {
      link: 'https://en.wikipedia.org/wiki/Spaced_repetition',
      screenTitle: 'Spaced Repetition',
    });
  }

  public showLeitnerSystemWiki(): void {
    RemoteLogger.logEvent('open_leitner_wiki_link');
    this.navigatorDelegate.showModal(ScreenName.BROWSER_SCREEN, {
      link: 'https://en.wikipedia.org/wiki/Leitner_system',
      screenTitle: 'Leither System',
    });
  }
}
