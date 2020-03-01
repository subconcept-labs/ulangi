/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefinitionBuilder } from '@ulangi/ulangi-common/builders';
import { ButtonSize, ErrorCode } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableVocabulary,
  ObservableVocabularyFormState,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { runInAction } from 'mobx';

import { RemoteLogger } from '../../RemoteLogger';
import { AddVocabularyScreenIds } from '../../constants/ids/AddVocabularyScreenIds';
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { AddEditVocabularyScreenDelegate } from './AddEditVocabularyScreenDelegate';
import { AddVocabularyDelegate } from './AddVocabularyDelegate';
import { VocabularyFormDelegate } from './VocabularyFormDelegate';

@boundClass
export class AddVocabularyScreenDelegate extends AddEditVocabularyScreenDelegate {
  private observableConverter: ObservableConverter;
  private addVocabularyDelegate: AddVocabularyDelegate;
  private vocabularyFormState: ObservableVocabularyFormState;

  public constructor(
    eventBus: EventBus,
    observableConverter: ObservableConverter,
    vocabularyFormState: ObservableVocabularyFormState,
    vocabularyInputDelegate: VocabularyFormDelegate,
    addVocabularyDelegate: AddVocabularyDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    super(eventBus, vocabularyInputDelegate, dialogDelegate, navigatorDelegate);

    this.observableConverter = observableConverter;
    this.addVocabularyDelegate = addVocabularyDelegate;
    this.vocabularyFormState = vocabularyFormState;
  }

  public saveAdd(checkDuplicate: boolean, closeOnSaveSucceeded: boolean): void {
    RemoteLogger.logEvent('add_vocabulary');

    this.addVocabularyDelegate.saveAdd(checkDuplicate, {
      onSaving: this.showSavingDialog,
      onSaveSucceeded: closeOnSaveSucceeded
        ? this.showSaveSucceededDialog
        : this.showWhatToDoNextDialog,
      onSaveFailed: (errorBag): void => {
        this.showSaveFailedDialogWithRetry(
          errorBag,
          (shouldCheckDuplicate: boolean): void => {
            this.saveAdd(shouldCheckDuplicate, closeOnSaveSucceeded);
          },
        );
      },
    });
  }

  public createPreview(): ObservableVocabulary {
    return this.addVocabularyDelegate.createPreview();
  }

  private showSaveFailedDialogWithRetry(
    errorBag: ErrorBag,
    retry: (checkDuplicate: boolean) => void,
  ): void {
    if (errorBag.errorCode === ErrorCode.VOCABULARY__DUPLICATE_TERM) {
      this.dialogDelegate.show({
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
        message:
          'You have added this term before. Do you want to add it again?',
        onBackgroundPress: (): void => {
          this.dialogDelegate.dismiss();
        },
        buttonList: [
          {
            testID: LightBoxDialogIds.CANCEL_BTN,
            text: 'NO',
            onPress: (): void => {
              this.dialogDelegate.dismiss();
            },
            styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
          {
            testID: LightBoxDialogIds.OKAY_BTN,
            text: 'YES',
            onPress: (): void => {
              retry(false);
            },
            styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
        ],
      });
    } else {
      this.showSaveFailedDialog(errorBag);
    }
  }

  private showWhatToDoNextDialog(): void {
    this.dialogDelegate.show({
      testID: LightBoxDialogIds.SUCCESS_DIALOG,
      message: 'Saved successfully. What do you want to do next?',
      onBackgroundPress: (): void => {
        this.dialogDelegate.dismiss();
        this.navigatorDelegate.pop();
      },
      buttonList: [
        {
          testID: LightBoxDialogIds.CLOSE_DIALOG_BTN,
          text: 'CLOSE',
          onPress: (): void => {
            this.dialogDelegate.dismiss();
            this.navigatorDelegate.pop();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
        {
          testID: AddVocabularyScreenIds.ADD_MORE_BTN,
          text: 'ADD MORE',
          onPress: (): void => {
            this.resetForms();
            this.dialogDelegate.dismiss();
          },
          styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
      ],
    });
  }

  private resetForms(): void {
    runInAction(
      (): void => {
        this.vocabularyFormState.reset();
        this.vocabularyFormState.definitions.push(
          this.observableConverter.convertToObservableDefinition(
            new DefinitionBuilder().build({ source: 'N/A' }),
          ),
        );
      },
    );
  }
}
