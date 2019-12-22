/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { LinkingDelegate } from '../../delegates/linking/LinkingDelegate';
import { SpacedRepetitionFAQScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionFAQScreenDelegate';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class SpacedRepetitionFAQScreenFactory extends ScreenFactory {
  public createScreenDelegate(): SpacedRepetitionFAQScreenDelegate {
    const dialogDelegate = this.createDialogDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const linkingDelegate = new LinkingDelegate(dialogDelegate);

    return new SpacedRepetitionFAQScreenDelegate(
      linkingDelegate,
      this.props.analytics
    );
  }
}
