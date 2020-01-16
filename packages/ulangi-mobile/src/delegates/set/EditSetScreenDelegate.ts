/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorBag, Set } from '@ulangi/ulangi-common/interfaces';
import { ObservableSetFormState } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { AddEditSetScreenDelegate } from './AddEditSetScreenDelegate';
import { EditSetDelegate } from './EditSetDelegate';
import { PickerDelegate } from './PickerDelegate';
import { SetFormDelegate } from './SetFormDelegate';

@boundClass
export class EditSetScreenDelegate extends AddEditSetScreenDelegate {
  private setFormState: ObservableSetFormState;
  private editSetDelegate: EditSetDelegate;

  public constructor(
    setFormState: ObservableSetFormState,
    setFormDelegate: SetFormDelegate,
    pickerDelegate: PickerDelegate,
    editSetDelegate: EditSetDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    super(setFormDelegate, pickerDelegate, dialogDelegate, navigatorDelegate);
    this.setFormState = setFormState;
    this.editSetDelegate = editSetDelegate;
  }

  public saveEdit(
    originalSet: Set,
    callback: {
      onSaving: () => void;
      onSaveSucceeded: (set: Set) => void;
      onSaveFailed: (errorBag: ErrorBag) => void;
    },
  ): void {
    if (this.setFormState.learningLanguageCode === null) {
      this.showLanguageNotSelectedDialog('learningLanguage');
    } else if (this.setFormState.translatedToLanguageCode === null) {
      this.showLanguageNotSelectedDialog('translatedToLanguage');
    } else {
      this.editSetDelegate.saveEdit(originalSet, callback);
    }
  }
}
