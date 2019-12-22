/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';
import { ObservableVocabulary } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { VocabularyFormDelegate } from './VocabularyFormDelegate';

@boundClass
export abstract class AddEditVocabularyScreenDelegate {
  private errorConverter = new ErrorConverter();

  protected eventBus: EventBus;
  protected vocabularyFormDelegate: VocabularyFormDelegate;
  protected navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    vocabularyFormDelegate: VocabularyFormDelegate,
    navigatorDelegate: NavigatorDelegate
  ) {
    this.eventBus = eventBus;
    this.vocabularyFormDelegate = vocabularyFormDelegate;
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
    this.navigatorDelegate.showDialog(
      {
        message: 'Saving. Please wait...',
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public showSaveSucceededDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
        message: 'Saved successfully.',
        showCloseButton: true,
        closeOnTouchOutside: true,
        onClose: (): void => {
          this.navigatorDelegate.pop();
        },
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public showSaveFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message: this.errorConverter.convertToMessage(errorCode),
        title: 'SAVE FAILED',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }
}
