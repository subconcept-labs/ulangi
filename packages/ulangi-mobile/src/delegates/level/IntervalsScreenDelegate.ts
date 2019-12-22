/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class IntervalsScreenDelegate {
  private navigatorDelegate: NavigatorDelegate;

  public constructor(navigatorDelegate: NavigatorDelegate) {
    this.navigatorDelegate = navigatorDelegate;
  }

  public dismissLightBox(): void {
    this.navigatorDelegate.dismissLightBox();
  }
}
