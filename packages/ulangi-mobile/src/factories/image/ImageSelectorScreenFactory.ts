/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableImageSelectorScreen } from '@ulangi/ulangi-observable';

import { ImageSelectorScreenDelegate } from '../../delegates/image/ImageSelectorScreenDelegate';
import { SearchImageDelegate } from '../../delegates/image/SearchImageDelegate';
import { UploadImageDelegate } from '../../delegates/image/UploadImageDelegate';
import { LinkingDelegate } from '../../delegates/linking/LinkingDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class ImageSelectorScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableImageSelectorScreen
  ): ImageSelectorScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const searchImageDelegate = new SearchImageDelegate(
      this.eventBus,
      this.props.observableConverter,
      observableScreen
    );

    const uploadImageDelegate = new UploadImageDelegate(this.eventBus);

    const linkingDelegete = new LinkingDelegate(dialogDelegate);

    return new ImageSelectorScreenDelegate(
      this.props.observableLightBox,
      observableScreen,
      searchImageDelegate,
      uploadImageDelegate,
      dialogDelegate,
      navigatorDelegate,
      linkingDelegete
    );
  }
}
