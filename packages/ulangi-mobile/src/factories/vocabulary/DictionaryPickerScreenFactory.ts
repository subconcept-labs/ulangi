/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import { ObservableDictionaryPickerScreen } from '@ulangi/ulangi-observable';

import { DictionaryEntryDelegate } from '../../delegates/dictionary/DictionaryEntryDelegate';
import { TranslationListDelegate } from '../../delegates/translation/TranslationListDelegate';
import { DictionaryPickerScreenDelegate } from '../../delegates/vocabulary/DictionaryPickerScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class DictionaryPickerScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableDictionaryPickerScreen,
    onPick: (definition: DeepPartial<Definition>) => void,
  ): DictionaryPickerScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dictionaryEntryDelegate = new DictionaryEntryDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.dictionaryEntryState,
    );

    const translationListDelegate = new TranslationListDelegate(
      this.eventBus,
      this.props.observableConverter,
      this.props.rootStore.setStore,
      observableScreen.translationListState,
    );

    return new DictionaryPickerScreenDelegate(
      observableScreen,
      dictionaryEntryDelegate,
      translationListDelegate,
      navigatorDelegate,
      onPick,
    );
  }
}
