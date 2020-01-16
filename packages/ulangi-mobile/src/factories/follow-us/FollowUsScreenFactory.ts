/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { FollowUsScreenDelegate } from '../../delegates/follow-us/FollowUsScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class FollowUsScreenFactory extends ScreenFactory {
  public createScreenDelegate(): FollowUsScreenDelegate {
    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    return new FollowUsScreenDelegate(dialogDelegate);
  }
}
