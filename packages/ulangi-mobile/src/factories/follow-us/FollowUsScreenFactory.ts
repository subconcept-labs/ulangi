/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { FollowUsScreenDelegate } from '../../delegates/follow-us/FollowUsScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class FollowUsScreenFactory extends ScreenFactory {
  public createScreenDelegate(): FollowUsScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new FollowUsScreenDelegate(navigatorDelegate);
  }
}
