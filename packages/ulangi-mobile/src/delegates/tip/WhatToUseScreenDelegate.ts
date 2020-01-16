/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { boundClass } from 'autobind-decorator';

import { RemoteLogger } from '../../RemoteLogger';
import { LinkingDelegate } from '../../delegates/linking/LinkingDelegate';

@boundClass
export class WhatToUseScreenDelegate {
  private linkingDelegate: LinkingDelegate;

  public constructor(linkingDelegate: LinkingDelegate) {
    this.linkingDelegate = linkingDelegate;
  }

  public showSpacedRepetitionWiki(): void {
    RemoteLogger.logEvent('open_srs_wiki_link');
    this.linkingDelegate.openLink(
      'https://en.wikipedia.org/wiki/Spaced_repetition',
    );
  }

  public showLeitnerSystemWiki(): void {
    RemoteLogger.logEvent('open_leitner_wiki_link');
    this.linkingDelegate.openLink(
      'https://en.wikipedia.org/wiki/Leitner_system',
    );
  }
}
