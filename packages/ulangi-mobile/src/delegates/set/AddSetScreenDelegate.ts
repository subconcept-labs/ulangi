/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { ObservableSetFormState } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { RemoteLogger } from '../../RemoteLogger';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { AddEditSetScreenDelegate } from './AddEditSetScreenDelegate';
import { AddSetDelegate } from './AddSetDelegate';
import { PickerDelegate } from './PickerDelegate';
import { SetFormDelegate } from './SetFormDelegate';

@boundClass
export class AddSetScreenDelegate extends AddEditSetScreenDelegate {
  private setFormState: ObservableSetFormState;
  private addSetDelegate: AddSetDelegate;

  public constructor(
    setFormState: ObservableSetFormState,
    setFormDelegate: SetFormDelegate,
    pickerDelegate: PickerDelegate,
    addSetDelegate: AddSetDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    super(setFormDelegate, pickerDelegate, dialogDelegate, navigatorDelegate);
    this.setFormState = setFormState;
    this.addSetDelegate = addSetDelegate;
  }

  public saveAdd(callback: {
    onSaving: () => void;
    onSaveSucceeded: () => void;
    onSaveFailed: (errorBag: ErrorBag) => void;
  }): void {
    RemoteLogger.logEvent('add_set');
    if (this.setFormState.learningLanguageCode === null) {
      this.showLanguageNotSelectedDialog('learningLanguage');
    } else if (this.setFormState.translatedToLanguageCode === null) {
      this.showLanguageNotSelectedDialog('translatedToLanguage');
    } else {
      this.addSetDelegate.saveAdd(callback);
    }
  }
}
