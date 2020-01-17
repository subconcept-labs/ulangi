/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { EventBus } from '@ulangi/ulangi-event';
import { ObservableVocabulary } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { EditVocabularyDelegate } from '../../delegates/vocabulary/EditVocabularyDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { AddEditVocabularyScreenDelegate } from './AddEditVocabularyScreenDelegate';
import { VocabularyFormDelegate } from './VocabularyFormDelegate';

@boundClass
export class EditVocabularyScreenDelegate extends AddEditVocabularyScreenDelegate {
  private editVocabularyDelegate: EditVocabularyDelegate;

  public constructor(
    eventBus: EventBus,
    vocabularyFormDelegate: VocabularyFormDelegate,
    editVocabularyDelegate: EditVocabularyDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    super(eventBus, vocabularyFormDelegate, dialogDelegate, navigatorDelegate);

    this.editVocabularyDelegate = editVocabularyDelegate;
  }

  public saveEdit(): void {
    this.editVocabularyDelegate.saveEdit({
      onSaving: this.showSavingDialog,
      onSaveSucceeded: this.showSaveSucceededDialog,
      onSaveFailed: this.showSaveFailedDialog,
    });
  }

  public createPreview(): ObservableVocabulary {
    return this.editVocabularyDelegate.createPreview();
  }
}
