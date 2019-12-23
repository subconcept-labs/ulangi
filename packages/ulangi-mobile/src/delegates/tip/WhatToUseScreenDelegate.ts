/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { boundClass } from 'autobind-decorator';

import { LinkingDelegate } from '../../delegates/linking/LinkingDelegate';

@boundClass
export class WhatToUseScreenDelegate {
  private linkingDelegate: LinkingDelegate;
  private analytics: AnalyticsAdapter;

  public constructor(
    linkingDelegate: LinkingDelegate,
    analytics: AnalyticsAdapter,
  ) {
    this.linkingDelegate = linkingDelegate;
    this.analytics = analytics;
  }

  public showSpacedRepetitionWiki(): void {
    this.analytics.logEvent('open_srs_wiki_link');
    this.linkingDelegate.openLink(
      'https://en.wikipedia.org/wiki/Spaced_repetition',
    );
  }

  public showLeitnerSystemWiki(): void {
    this.analytics.logEvent('open_leitner_wiki_link');
    this.linkingDelegate.openLink(
      'https://en.wikipedia.org/wiki/Leitner_system',
    );
  }
}
