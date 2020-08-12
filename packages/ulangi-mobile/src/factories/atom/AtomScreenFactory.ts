/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAtomScreen } from '@ulangi/ulangi-observable';

import { AtomScreenDelegate } from '../../delegates/atom/AtomScreenDelegate';
import { FetchVocabularyDelegate } from '../../delegates/atom/FetchVocabularyDelegate';
import { PrepareFetchVocabularyDelegate } from '../../delegates/atom/PrepareFetchVocabularyDelegate';
import { atomStyles } from '../../styles/AtomStyles';
import { ScreenFactory } from '../ScreenFactory';

export class AtomScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableAtomScreen,
  ): AtomScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      atomStyles.getLightBoxScreenStyles(),
    );

    const prepareFetchVocabularyDelegate = new PrepareFetchVocabularyDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      observableScreen,
    );

    const fetchVocabularyDelegate = new FetchVocabularyDelegate(this.eventBus);

    return new AtomScreenDelegate(
      observableScreen,
      prepareFetchVocabularyDelegate,
      fetchVocabularyDelegate,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
