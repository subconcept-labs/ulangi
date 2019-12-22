/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservablePublicSetDetailScreen } from '@ulangi/ulangi-observable';

import { AddVocabularyDelegate } from '../../delegates/discover/AddVocabularyDelegate';
import { PublicSetDetailScreenDelegate } from '../../delegates/discover/PublicSetDetailScreenDelegate';
import { PublicVocabularyActionMenuDelegate } from '../../delegates/discover/PublicVocabularyActionMenuDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class PublicSetDetailScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservablePublicSetDetailScreen
  ): PublicSetDetailScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const addVocabularyDelegate = new AddVocabularyDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.analytics
    );

    const publicVocabularyActionMenuDelegate = new PublicVocabularyActionMenuDelegate(
      this.props.observableLightBox,
      this.props.rootStore.setStore,
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    return new PublicSetDetailScreenDelegate(
      observableScreen.publicSet,
      addVocabularyDelegate,
      publicVocabularyActionMenuDelegate,
      navigatorDelegate
    );
  }
}
