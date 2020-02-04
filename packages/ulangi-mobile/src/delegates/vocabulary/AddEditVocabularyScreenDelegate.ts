/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Definition, ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';
import { ObservableVocabulary } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { VocabularyFormDelegate } from './VocabularyFormDelegate';

@boundClass
export abstract class AddEditVocabularyScreenDelegate {
  protected eventBus: EventBus;
  protected vocabularyFormDelegate: VocabularyFormDelegate;
  protected dialogDelegate: DialogDelegate;
  protected navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    vocabularyFormDelegate: VocabularyFormDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.vocabularyFormDelegate = vocabularyFormDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public abstract createPreview(): ObservableVocabulary;

  public addDefinitionSlot(): void {
    this.vocabularyFormDelegate.addDefinitionSlot();
  }

  public addDefinition(definition: DeepPartial<Definition>): void {
    this.vocabularyFormDelegate.addDefinition(definition);
  }

  public deleteDefinition(index: number): void {
    this.vocabularyFormDelegate.showConfirmDeleteDefinition(index);
  }

  public lookUp(): void {
    this.vocabularyFormDelegate.lookUp();
  }

  public showVocabularyExtraFieldsPicker(): void {
    this.vocabularyFormDelegate.showVocabularyExtraFieldsPicker();
  }

  public showDefinitionExtraFieldsPicker(index: number): void {
    this.vocabularyFormDelegate.showDefinitionExtraFieldsPicker(index);
  }

  public editCategory(): void {
    this.vocabularyFormDelegate.editCategory();
  }

  public showSavingDialog(): void {
    this.dialogDelegate.showSavingDialog();
  }

  public showSaveSucceededDialog(): void {
    this.dialogDelegate.showSaveSucceededDialog();
  }

  public showSaveFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showSaveFailedDialog(errorBag);
  }
}
