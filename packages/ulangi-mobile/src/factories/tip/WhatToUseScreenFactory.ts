/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { LinkingDelegate } from '../../delegates/linking/LinkingDelegate';
import { WhatToUseScreenDelegate } from '../../delegates/tip/WhatToUseScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class WhatToUseScreenFactory extends ScreenFactory {
  public createScreenDelegate(): WhatToUseScreenDelegate {
    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const linkingDelegate = new LinkingDelegate(dialogDelegate);

    return new WhatToUseScreenDelegate(linkingDelegate);
  }
}
